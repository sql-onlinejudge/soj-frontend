export interface SortItem {
  field: string
  direction: 'asc' | 'desc'
}

interface FilterPanelProps {
  minDifficulty: number
  maxDifficulty: number
  onDifficultyChange: (min: number, max: number) => void
  sorts: SortItem[]
  onSortsChange: (sorts: SortItem[]) => void
}

const sortOptions = [
  { value: 'id', label: '문제 번호' },
  { value: 'difficulty', label: '난이도' },
  { value: 'submittedCount', label: '제출 수' },
  { value: 'solvedCount', label: '정답 수' },
]

export function FilterPanel({
  minDifficulty,
  maxDifficulty,
  onDifficultyChange,
  sorts,
  onSortsChange,
}: FilterPanelProps) {
  return (
    <div className="bg-surface-panel rounded-lg p-4 w-full">
      <h3 className="text-base font-medium text-text-primary mb-4">검색 필터</h3>

      <div className="mb-4">
        <label className="text-base text-black">
          난이도 Lv.{minDifficulty} ~ Lv.{maxDifficulty}
        </label>
        <div className="relative mt-5 h-5 mx-2">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-gray-200 rounded-full" />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-accent-blue rounded-full"
            style={{
              left: `${((minDifficulty - 1) / 4) * 100}%`,
              right: `${((5 - maxDifficulty) / 4) * 100}%`,
            }}
          />
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={minDifficulty}
            onChange={(e) => {
              const val = Number(e.target.value)
              if (val <= maxDifficulty) onDifficultyChange(val, maxDifficulty)
            }}
            className="absolute top-0 left-0 w-full h-5 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-blue-dark [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
            style={{ zIndex: minDifficulty > 3 ? 5 : 3 }}
          />
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={maxDifficulty}
            onChange={(e) => {
              const val = Number(e.target.value)
              if (val >= minDifficulty) onDifficultyChange(minDifficulty, val)
            }}
            className="absolute top-0 left-0 w-full h-5 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-blue [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
            style={{ zIndex: maxDifficulty <= 3 ? 5 : 3 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400 mx-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <span key={level}>{level}</span>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 my-4" />

      <div>
        <label className="text-base text-black">정렬</label>
        <div className="mt-2 space-y-2">
          {sortOptions.map((option) => {
            const sortItem = sorts.find((s) => s.field === option.value)
            const isSelected = !!sortItem
            const direction = sortItem?.direction ?? 'asc'
            const order = isSelected ? sorts.findIndex((s) => s.field === option.value) + 1 : null

            const handleToggle = () => {
              if (isSelected) {
                onSortsChange(sorts.filter((s) => s.field !== option.value))
              } else {
                onSortsChange([...sorts, { field: option.value, direction: 'asc' }])
              }
            }

            const handleDirectionToggle = () => {
              onSortsChange(
                sorts.map((s) =>
                  s.field === option.value
                    ? { ...s, direction: s.direction === 'asc' ? 'desc' : 'asc' }
                    : s
                )
              )
            }

            return (
              <div key={option.value} className="flex items-center gap-2">
                <button
                  onClick={handleToggle}
                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                    isSelected ? 'bg-accent-blue' : 'bg-white border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {isSelected && (
                    <span className="text-white text-[10px] font-bold">✓</span>
                  )}
                </button>
                <span className="text-sm text-black flex-1">
                  {option.label}
                  {order !== null && sorts.length > 1 && (
                    <span className="ml-1 text-xs text-text-secondary">({order})</span>
                  )}
                </span>
                {isSelected && (
                  <button
                    onClick={handleDirectionToggle}
                    className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded"
                  >
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${direction === 'desc' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span>{direction === 'asc' ? '오름차순' : '내림차순'}</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
