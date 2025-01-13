import React from 'react';
import { Pagination } from 'react-bootstrap';

const Paginate = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  visiblePages = 5,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);
  const adjustedStartPage = Math.max(1, endPage - visiblePages + 1);

  const paginationItems = [];

  if (adjustedStartPage > 1) {
    paginationItems.push(
      <Pagination.Item key={1} onClick={() => onPageChange(1)}>
        1
      </Pagination.Item>
    );
    if (adjustedStartPage > 2) {
      paginationItems.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }
  }

  for (let i = adjustedStartPage; i <= endPage; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationItems.push(<Pagination.Ellipsis key="end-ellipsis" />);
    }
    paginationItems.push(
      <Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
        {totalPages}
      </Pagination.Item>
    );
  }

  return (
    <Pagination className="justify-content-center">
      {currentPage > 1 && (
        <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} />
      )}
      {paginationItems}
      {currentPage < totalPages && (
        <Pagination.Next onClick={() => onPageChange(currentPage + 1)} />
      )}
    </Pagination>
  );
};

export default Paginate;
