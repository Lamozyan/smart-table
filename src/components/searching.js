export function initSearching(searchField, fieldName = "search") {
  return (query, state, action) => {
    // Проверяем, что в поле поиска было что-то введено
    const searchValue = state[fieldName];
    
    return searchValue 
      ? Object.assign({}, query, {
          search: searchValue // устанавливаем в query параметр search
        }) 
      : query; // если поле с поиском пустое, просто возвращаем query без изменений
  };
}