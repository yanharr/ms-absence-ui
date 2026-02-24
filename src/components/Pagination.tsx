import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages === 0) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
  <div className="flex items-center justify-center mt-4 gap-2">
        <button
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
        >
            Prev
        </button>

        {pages.map((page) => (
            <button
                key={page}
                className={`
                px-3 py-1 rounded border border-gray-300 transition
                ${page === currentPage ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 hover:bg-gray-100'}
                `}
                onClick={() => onPageChange(page)}
            >
                {page}
            </button>
        ))}

        <button
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
        >
        Next
        </button>
    </div>
    );
};

export default Pagination;