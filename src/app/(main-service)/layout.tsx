import NavBar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/SideBar";
import SearchDialog from "@/components/ui/dialog/SearchDialog";
import ResponsiveSidebarProvider from "@/components/ui/sidebar/ResponsiveSidebarProvider";
import SidebarSpacer from "@/components/ui/sidebar/SidebarSpacer";

export default function NavBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      <div
        aria-hidden
        className="hidden lg:block absolute inset-y-0 left-0 w-[110px] bg-main"
      />
      <div className="hidden lg:block relative z-10">
        <NavBar />
      </div>

      <ResponsiveSidebarProvider>
        <SidebarSpacer>{children}</SidebarSpacer>
        <SideBar />
        <SearchDialog />
      </ResponsiveSidebarProvider>
    </div>
  );
}
