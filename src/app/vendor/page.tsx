import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-actions";

// Always server-rendered — never statically generated.
export const dynamic = "force-dynamic";

// /vendor is not a public page.
// Route authenticated vendors to the right destination based on their status.
export default async function VendorRootPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?from=/vendor/dashboard");
  }

  if (session.user.role !== "VENDOR") {
    redirect("/");
  }

  if (session.user.status === "INACTIVE") {
    redirect("/suspended");
  }

  if (session.user.status === "PENDING") {
    redirect("/vendor/pending");
  }

  // ACTIVE vendor
  redirect("/vendor/dashboard");
}
