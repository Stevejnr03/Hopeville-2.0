function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, label = "items" }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  // Smart page numbers — show ellipsis for large page counts
  function getPageNumbers() {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  }

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-[#e8e8e8]">
      <p className="text-xs text-[#888]">
        Showing {start}–{end} of {totalItems} {label}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm">
          ‹
        </button>
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-[#888] text-xs">
              ...
            </span>
          ) : (
            <button key={page} onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center border text-xs transition-all ${
                currentPage === page
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
              }`}>
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center border border-[#e8e8e8] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm">
          ›
        </button>
      </div>
    </div>
  );
}

export default Pagination;