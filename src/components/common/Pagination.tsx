import { Button } from './Button'

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
        pages.push('...')
      }

      const start = Math.max(1, currentPage - 1)
      const end = Math.min(totalPages - 2, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push('...')
      }

      if (!pages.includes(totalPages - 1)) {
        pages.push(totalPages - 1)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="w-8 px-0"
      >
        ‹
      </Button>

      {getVisiblePages().map((page, index) =>
        typeof page === 'string' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-text-secondary">
            {page}
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`w-8 px-0 ${currentPage === page ? 'bg-accent-blue hover:bg-accent-blue-dark' : ''}`}
          >
            {page + 1}
          </Button>
        )
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className="w-8 px-0"
      >
        ›
      </Button>
    </div>
  )
}
