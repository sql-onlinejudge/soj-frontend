interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = '검색어를 입력하세요.',
}: SearchInputProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-4 border border-border-input rounded-md bg-white text-base placeholder:text-text-secondary focus:outline-none focus:border-gray-400 transition-colors"
      />
    </div>
  )
}
