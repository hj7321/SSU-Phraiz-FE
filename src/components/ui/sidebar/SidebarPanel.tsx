import FolderTree from "./FolderTree";

const SidebarPanel = () => {
  return (
    <div className="p-[10px] h-full min-h-0 min-w-0 overflow-y-auto my-[10px]">
      <FolderTree />
    </div>
  );
};

export default SidebarPanel;
