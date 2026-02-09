interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(0)

      if (currentPage > 2) {
        pages.push('…')
      }

      const start = Math.max(1, currentPage - 1)
      const end = Math.min(totalPages - 2, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push('…')
      }

      if (!pages.includes(totalPages - 1)) {
        pages.push(totalPages - 1)
      }
    }

    return pages
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-6" aria-label="페이지 네비게이션">
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="w-10 h-10 flex items-center justify-center rounded border border-border-light text-text-secondary hover:bg-surface-muted hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {getVisiblePages().map((page, index) =>
        typeof page === 'string' ? (
          <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded border text-sm transition-all ${
              currentPage === page
                ? 'border-brand-primary bg-brand-primary text-white'
                : 'border-border-light text-text-secondary hover:bg-surface-muted hover:shadow-sm'
            }`}
            aria-label={`${page + 1} 페이지`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page + 1}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className="w-10 h-10 flex items-center justify-center rounded border border-border-light text-text-secondary hover:bg-surface-muted hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  )
}
