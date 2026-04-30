import { sortMap } from "../lib/sort.js"; // sortCollection больше не нужен

export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      action.dataset.value = sortMap[action.dataset.value] || "none";
      field = action.dataset.field;
      order = action.dataset.value;
      
      columns.forEach((column) => {
        if (column !== action && column.dataset.field !== field) {
          column.dataset.value = "none";
        }
      });
    } else {
      columns.forEach((column) => {
        if (column.dataset.value && column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    // Сохраняем в переменную параметр сортировки в виде field:direction
    const sort = (field && order && order !== 'none') ? `${field}:${order}` : null;
    
    // По общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query
    return sort ? Object.assign({}, query, { sort }) : query;
  };
}