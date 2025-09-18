import NavBar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/SideBar";
import { SidebarProvider } from "@/components/sidebar/Sidebar";
import SearchDialog from "@/components/ui/dialog/SearchDialog";

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
      <SidebarProvider defaultOpen={false} panelWidth={312} railWidth={56}>
        {/* ✅ 본문이 사이드바 폭만큼 항상 줄어들도록 */}
        <main
          className="w-full flex min-h-0"
          style={{
            paddingRight: "var(--sb-w)",
            transition: "padding-right 320ms cubic-bezier(.22,.8,.22,1)", // ⬅️ 추가
            willChange: "padding-right",
          }}
        >
          {children}
        </main>
        <SideBar />
        <SearchDialog />
      </SidebarProvider>
    </div>
  );
}
