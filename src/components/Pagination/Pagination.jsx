// File Location: src/components/Pagination/Pagination.jsx

import React from "react";
import styles from "./Pagination.module.css"; // Optional for styling

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className={styles.pagination}>
      {/* Show "First" only if not on the first page */}
      {currentPage > 1 && (
        <button
          className={styles.button}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
      )}

      {/* Show "Previous" only if not on the first page */}
      {currentPage > 1 && (
        <button
          className={styles.button}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      )}

      <span className={styles.info}>
        Page {currentPage} of {totalPages}
      </span>

      {/* Show "Next" only if not on the last page */}
      {currentPage < totalPages && (
        <button
          className={styles.button}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      )}

      {/* Show "Last" only if not on the last page */}
      {currentPage < totalPages && (
        <button
          className={styles.button}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      )}
    </div>
  );
}
