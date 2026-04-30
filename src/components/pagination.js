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
    
    // Переносим код для обработки действий пагинации
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
    
    // Возвращаем параметры пагинации для запроса к серверу
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
    
    // Вычисляем количество страниц на основе общего количества записей и лимита
    pageCount = Math.ceil(total / limit);
    
    // Получаем видимые страницы для отображения
    const visiblePages = getPages(page, pageCount, 5);
    
    // Перерисовываем пагинатор с новыми данными
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      })
    );
    
    // Обновляем информацию о отображаемых строках
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };
  
  return {
    updatePagination,
    applyPagination,
  };
};