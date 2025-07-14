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
      <NavBar />
      <SidebarProvider defaultOpen={false}>
        <main className="flex-1 flex">{children}</main>
        <SideBar />
        <SearchDialog />
      </SidebarProvider>
    </div>
  );
}
