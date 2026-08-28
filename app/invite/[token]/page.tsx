import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/server";
import { InviteDetails } from "@/components/invite/InviteDetails";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const session = await getAuthSession();

  if (!session.data?.user) {
    redirect("/sign-in");
  }

  return <InviteDetails token={token} submitted={query.submitted === "1"} />;
}
