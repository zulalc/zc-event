import DashboardDetails from "@/components/DashboardDetails";
import { getAuthSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session.data?.user?.id) {
    redirect("/auth/sign-in");
  }

  const userId = session.data.user.id;

  return <DashboardDetails userId={userId} />;
}
