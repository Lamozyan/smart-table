export function initSearching(searchField, fieldName = "search") {
  return (query, state, action) => {
    // Проверяем наличие searchField и его элементов
    let searchValue = null;
    
    if (searchField && searchField.search) {
      searchValue = searchField.search.value;
    } else if (state[fieldName]) {
      searchValue = state[fieldName];
    }
    
    return searchValue
      ? Object.assign({}, query, {
          search: searchValue,
        })
      : query;
  };
}