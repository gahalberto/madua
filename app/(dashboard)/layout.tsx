import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardClientWrapper } from "@/components/dashboard-client-wrapper";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <DashboardClientWrapper>{children}</DashboardClientWrapper>;
}
