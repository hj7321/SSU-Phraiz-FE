import NavBar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/SideBar";

export default function NavBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full">
      <NavBar />
      <main className="flex-1">{children}</main>
      <SideBar />
    </div>
  );
}
