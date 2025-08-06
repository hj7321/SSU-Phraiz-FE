import NavBar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/SideBar";
import SearchDialog from "@/components/ui/dialog/SearchDialog";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar";

export default function NavBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <div className="hidden lg:block">
        <NavBar />
      </div>
      <SidebarProvider defaultOpen={false}>
        <main className="w-full flex">{children}</main>
        <SideBar />
        <SearchDialog />
      </SidebarProvider>
    </div>
  );
}
