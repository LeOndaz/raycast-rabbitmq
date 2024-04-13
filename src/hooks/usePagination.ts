import { useState } from "react";


export const usePagination = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const next = () => {
    setPage(p => p + 1);
  };

  const prev = () => {
    if (page === 1) {
      return;
    }

    setPage(p => p - 1);
  };

  const updatePageSize = (count: number) => {
    if (count >= 50) {
      count = 50;
    }

    setPageSize(count);
  };

  return {
    page,
    pageSize,
    updatePageSize,
    setPage: (page: number) => {
      if (page <= 1) {
        page = 1;
      }

      setPage(page);
    },
    prev,
    next
  };
};