import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <UserProfile path="/profile" routing="path" />
    </div>
  );
}
