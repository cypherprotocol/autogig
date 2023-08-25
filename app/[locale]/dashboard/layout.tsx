import { currentUser } from "@clerk/nextjs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <div className="hidden h-full w-full flex-1 flex-col space-y-8 p-8 md:flex">
      {user?.publicMetadata.role === "admin" && children}
    </div>
  );
}
