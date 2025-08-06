interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
  const tabs = ["Posts", "Experience", "Education", "Activity"];

  return (
    <div className="flex gap-8 border-b border-gray-200 bg-white/50 backdrop-blur-xs rounded-t-xl px-6 py-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-4 px-2 text-base font-semibold border-b-2 transition-all duration-200 ${
            activeTab === tab
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
