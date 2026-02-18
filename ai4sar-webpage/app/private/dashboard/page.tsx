// link to other domain
import { redirect } from "next/navigation";

export default function PrivateDashboardRedirect() {
  redirect("https://intelisar-calpoly.vercel.app/incidents");
}