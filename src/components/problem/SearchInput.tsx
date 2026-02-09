interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = '문제 검색…',
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        id="problem-search"
        name="keyword"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="문제 검색"
        className="w-full h-11 pl-10 pr-4 border border-border-light rounded-lg bg-surface-panel text-text-primary text-base placeholder:text-text-secondary outline-2 outline-offset-2 outline-transparent focus-visible:outline-brand-primary transition-all duration-200"
      />
    </div>
  )
}
