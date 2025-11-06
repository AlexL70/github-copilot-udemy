import React, { useState } from "react";

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

/**
 * A pagination component that provides navigation controls for paginated content.
 *
 * @param props - The pagination component props
 * @param props.totalPages - The total number of pages available
 * @param props.initialPage - The initial page to display (defaults to 1)
 * @param props.onPageChange - Optional callback function called when the current page changes
 *
 * @returns A React functional component that renders pagination controls including:
 * - Previous button (disabled on first page)
 * - Page selector dropdown showing current page and total pages
 * - Next button (disabled on last page)
 *
 * @example
 * ```tsx
 * <Pagination
 *   totalPages={10}
 *   initialPage={1}
 *   onPageChange={(page) => console.log(`Current page: ${page}`)}
 * />
 * ```
 */
const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  initialPage = 1,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // Call onPageChange when currentPage changes
  React.useEffect(() => {
    if (onPageChange) {
      onPageChange(currentPage);
    }
  }, [currentPage, onPageChange]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(Number(event.target.value));
  };

  return (
    <div>
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        {"<"}
      </button>

      <span>
        Page{" "}
        <select value={currentPage} onChange={handleSelectChange}>
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>{" "}
        of {totalPages}
      </span>

      <button onClick={handleNext} disabled={currentPage === totalPages}>
        {">"}
      </button>
    </div>
  );
};

export default Pagination;
