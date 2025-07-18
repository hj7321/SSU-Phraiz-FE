import FolderTree from "./FolderTree";

const SidebarPanel = () => {
  return (
    <div className="p-[10px] h-full overflow-y-auto border-t border-[#d7d1f8] my-[10px]">
      <FolderTree />
    </div>
  );
};

export default SidebarPanel;
