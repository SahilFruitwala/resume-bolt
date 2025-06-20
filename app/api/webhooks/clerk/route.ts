import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  // Get the necessary headers from Clerk
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return new Response(
      "Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
      {
        status: 500,
      }
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  let payload: WebhookEvent;
  try {
    payload = await req.json();
  } catch (err) {
    console.error("Error parsing webhook payload:", err);
    return new Response("Error occurred -- could not parse payload", {
      status: 400,
    });
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred -- could not verify webhook", {
      status: 400,
    });
  }

  // Get the type of webhook event
  const eventType = evt.type;
  console.log(`Received webhook event: ${eventType}`);

  // Process the event
  try {
    switch (eventType) {
      case "user.created":
        const {
          id: clerkUserId_created,
          email_addresses: emailAddresses_created,
          first_name: firstName_created,
          last_name: lastName_created,
        } = evt.data;

        if (!clerkUserId_created) {
          console.error("user.created event is missing clerkUserId");
          return new Response(
            "Error: Missing clerkUserId in user.created event",
            { status: 400 }
          );
        }

        const primaryEmail_created = emailAddresses_created?.find(
          (email) =>
            "primary_email_address_id" in evt.data &&
            email.id ===
              (evt.data as { primary_email_address_id: string })
                .primary_email_address_id
        )?.email_address;

        if (!primaryEmail_created) {
          console.error("user.created event is missing primary email");
          // Depending on requirements, you might still create the user or return an error
          // For now, we'll return an error if primary email is crucial.
          return new Response(
            "Error: Missing primary email for user.created event",
            { status: 400 }
          );
        }

        console.log(
          `Processing user.created for Clerk User ID: ${clerkUserId_created}`
        );
        await db.insert(users).values({
          id: clerkUserId_created,
          email: primaryEmail_created,
          firstName: firstName_created,
          lastName: lastName_created,
          // createdAt and updatedAt will use default values
        });
        console.log(`User ${clerkUserId_created} created successfully.`);
        break;

      case "user.updated":
        const {
          id: clerkUserId_updated,
          email_addresses: emailAddresses_updated,
          first_name: firstName_updated,
          last_name: lastName_updated,
        } = evt.data;

        if (!clerkUserId_updated) {
          console.error("user.updated event is missing clerkUserId");
          return new Response(
            "Error: Missing clerkUserId in user.updated event",
            { status: 400 }
          );
        }

        const primaryEmail_updated = emailAddresses_updated?.find(
          (email) =>
            "primary_email_address_id" in evt.data &&
            email.id ===
              (evt.data as { primary_email_address_id: string })
                .primary_email_address_id
        )?.email_address;

        if (!primaryEmail_updated) {
          console.error("user.updated event is missing primary email");
          // For updates, you might choose to proceed without email if other fields are updated,
          // or enforce its presence. Here, we'll log and proceed if email is missing,
          // but update other fields.
        }

        console.log(
          `Processing user.updated for Clerk User ID: ${clerkUserId_updated}`
        );

        const updateData: Partial<typeof users.$inferInsert> = {
          firstName: firstName_updated,
          lastName: lastName_updated,
          updatedAt: new Date(), // Explicitly set updatedAt
        };

        if (primaryEmail_updated) {
          updateData.email = primaryEmail_updated;
        }

        await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, clerkUserId_updated));
        console.log(`User ${clerkUserId_updated} updated successfully.`);
        break;

      // TODO: Add other event types as needed e.g user.deleted
      case "user.deleted":
        const { id: clerkUserId_deleted } = evt.data;
        if (!clerkUserId_deleted) {
          console.error("user.deleted event is missing clerkUserId");
          return new Response(
            "Error: Missing clerkUserId in user.deleted event",
            { status: 400 }
          );
        }
        console.log(
          `Processing user.deleted for Clerk User ID: ${clerkUserId_deleted}`
        );
        await db
          .update(users)
          .set({ isActive: false })
          .where(eq(users.id, clerkUserId_deleted));
        console.log(`User ${clerkUserId_deleted} in activated successfully.`);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (dbError) {
    console.error(
      "Error processing webhook event and interacting with database:",
      dbError
    );
    return new Response("Error occurred during database operation", {
      status: 500,
    });
  }

  return new Response("Webhook received and processed successfully", {
    status: 200,
  });
}
