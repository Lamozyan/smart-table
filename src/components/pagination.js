import { getPages } from "../lib/utils.js"; // Добавьте в начало

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();
  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;
    
    if (action && pageCount) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, (page || 1) - 1);
          break;
        case "next":
          page = Math.min(pageCount, (page || 1) + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }
    }
    
    return Object.assign({}, query, {
      limit: limit || 10,
      page: page || 1,
    });
  };

  const updatePagination = (total, { page, limit }) => {
    if (!total || total === 0) {
      pages.replaceChildren();
      fromRow.textContent = "0";
      toRow.textContent = "0";
      totalRows.textContent = "0";
      pageCount = 0;
      return;
    }
    
    pageCount = Math.ceil(total / limit);
    const visiblePages = getPages(page, pageCount, 5);
    
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      })
    );
    
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };
  
  return {
    updatePagination,
    applyPagination,
  };
};