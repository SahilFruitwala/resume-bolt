import { auth, clerkClient } from "@clerk/nextjs/server";
// import { db } from "@/db";
// import { users } from "@/db/schema";
// import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

export async function PUT(request: Request) {
  logger.info("User update request received");
  try {
    const { userId } = await auth();
    if (!userId) {
      logger.warn("Unauthorized request to update user");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    // Destructure firstName, lastName, and email. partnerName is no longer used.
    const { firstName, lastName, email } = body;

    // Basic validation
    if (
      firstName !== undefined &&
      (typeof firstName !== "string" || firstName.trim() === "")
    ) {
      logger.warn("Invalid firstName format");
      return new NextResponse(
        "Invalid firstName format. Must be a non-empty string.",
        { status: 400 }
      );
    }
    if (
      lastName !== undefined &&
      (typeof lastName !== "string" || lastName.trim() === "")
    ) {
      logger.warn("Invalid lastName format");
      return new NextResponse(
        "Invalid lastName format. Must be a non-empty string.",
        { status: 400 }
      );
    }
    if (
      email !== undefined &&
      (typeof email !== "string" || !email.includes("@"))
    ) {
      logger.warn("Invalid email format");
      return new NextResponse("Invalid email format", { status: 400 });
    }

    // Prepare updates for database and Clerk
    const dbUpdateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
    } = {};
    const clerkUpdateData: {
      firstName?: string;
      lastName?: string;
      emailAddress?: string[];
    } = {};

    if (firstName) {
      dbUpdateData.firstName = firstName;
      clerkUpdateData.firstName = firstName;
    }
    if (lastName) {
      dbUpdateData.lastName = lastName;
      clerkUpdateData.lastName = lastName;
    }
    if (email) {
      dbUpdateData.email = email;
      clerkUpdateData.emailAddress = [email];
    }

    // Update user in database only if there's something to update
    // if (Object.keys(dbUpdateData).length > 0) {
    //   await db.update(users).set(dbUpdateData).where(eq(users.clerkUserId, userId));
    // }

    // Update user in Clerk only if there's something to update
    const client = await clerkClient();
    try {
      if (Object.keys(clerkUpdateData).length > 0) {
        await client.users.updateUser(userId, clerkUpdateData);
      }
    } catch (error) {
      logger.error("Error updating user in Clerk:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // Check if any data was actually sent for update
    // if (Object.keys(dbUpdateData).length === 0 && Object.keys(clerkUpdateData).length === 0) {
    //   return NextResponse.json({ message: 'No update data provided.' }, { status: 400 });
    // }
    if (Object.keys(clerkUpdateData).length === 0) {
      logger.warn("No update data provided");
      return NextResponse.json(
        { message: "No update data provided." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error updating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  logger.info("User delete request received");
  try {
    const { userId } = await auth();
    if (!userId) {
      logger.warn("Unauthorized request to delete user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Delete user from the local database
    // try {
    //   await db.delete(users).where(eq(users.clerkUserId, userId));
    // } catch (dbError) {
    //   logger.error('Error deleting user from database:', dbError);
    //   return NextResponse.json({ error: 'Failed to delete user from database' }, { status: 500 });
    // }

    // 2. Delete user from Clerk
    const client = await clerkClient();
    try {
      await client.users.deleteUser(userId);
    } catch (clerkError) {
      logger.error("Error deleting user from Clerk:", clerkError);
      // Potentially, the user is deleted from DB but not from Clerk.
      // For now, return a generic error. Production apps might need more robust error handling here.
      return NextResponse.json(
        { error: "Failed to delete user from Clerk" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Catch any unexpected errors (e.g., if auth() itself throws an error, though unlikely for this case)
    logger.error("Unexpected error during account deletion:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
