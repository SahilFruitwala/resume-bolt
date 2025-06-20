import { Waitlist } from "@clerk/nextjs";

export default function WaitlistPage() {
return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <Waitlist afterJoinWaitlistUrl="/" />
  </div>
);
}
