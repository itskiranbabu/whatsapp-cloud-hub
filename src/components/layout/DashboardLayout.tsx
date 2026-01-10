import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout = ({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-[260px] transition-all duration-200">
        <Header title={title} subtitle={subtitle} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
