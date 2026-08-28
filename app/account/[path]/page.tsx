import { AccountView, accountViewPaths } from "@neondatabase/auth/react";

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <AccountView path={path} />
    </main>
  );
}

export default AccountPage;
