import Image from "next/image";

const SideBar = () => {
  return (
    <aside className="bg-[#FBF9FE] py-[20px] pl-[13px] pr-[8px] flex flex-col gap-[20px]">
      <Image
        src="/icons/usage-history.svg"
        alt="사용 기록"
        width={18}
        height={18}
        className="hover:cursor-pointer"
      />
      <Image
        src="/icons/history-search.svg"
        alt="기록 검색"
        width={18}
        height={18}
        className="hover:cursor-pointer"
      />
      <Image
        src="/icons/new-chat.svg"
        alt="새 채팅"
        width={18}
        height={18}
        className="hover:cursor-pointer"
      />
    </aside>
  );
};

export default SideBar;
