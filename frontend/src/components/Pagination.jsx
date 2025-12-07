import React from 'react';

const Pagination = ({ page, pages, onPageChange }) => (
    <div className="flex items-center justify-center gap-2 mt-6">
        <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 disabled:opacity-50 dark:text-white"
        >
            Previous
        </button>
        <span className="px-4 py-2 dark:text-white">Page {page} of {pages}</span>
        <button
            disabled={page === pages}
            onClick={() => onPageChange(page + 1)}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 disabled:opacity-50 dark:text-white"
        >
            Next
        </button>
    </div>
);

export default Pagination;
