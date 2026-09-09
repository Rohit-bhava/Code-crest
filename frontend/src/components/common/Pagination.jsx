import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Previous
      </button>
      <span className="pagination-info">
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        Next
      </button>
      <style>{`
        .pagination { display:flex; align-items:center; gap:12px; justify-content:center; margin-top:24px; }
        .pagination-info { font-size:0.9rem; color:#64748b; }
      `}</style>
    </div>
  );
}
