import SignUpShell from "@/components/shell/SignUpShell";

export default function Loading() {
  return (
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex justify-center items-center">
      <div className="bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0_0_10px_rgba(0,0,0,0.4))] mt-[-90px]">
        <SignUpShell />
      </div>
    </section>
  );
}
