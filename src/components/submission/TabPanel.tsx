interface Tab {
  id: string
  label: string
}

interface TabPanelProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  children: React.ReactNode
}

export function TabPanel({
  tabs,
  activeTab,
  onTabChange,
  children,
}: TabPanelProps) {
  return (
    <div className="bg-surface-muted h-full flex flex-col">
      <div className="flex gap-3 px-5 pt-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`text-base font-medium pb-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-text-light border-brand-primary'
                : 'text-text-muted border-transparent hover:text-text-light'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

interface TabPanelContainerProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  children: (activeTab: string) => React.ReactNode
}

const tabs: Tab[] = [
  { id: 'execution', label: '실행 결과' },
  { id: 'judge', label: '채점 결과' },
  { id: 'history', label: '내 제출 기록' },
]

export function TabPanelContainer({
  activeTab,
  onTabChange,
  children,
}: TabPanelContainerProps) {
  return (
    <TabPanel tabs={tabs} activeTab={activeTab} onTabChange={onTabChange}>
      {children(activeTab)}
    </TabPanel>
  )
}
