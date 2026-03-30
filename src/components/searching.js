export function initSearching(searchField, fieldName = "search") {
  return (query, state, action) => {
    return state[fieldName] 
      ? Object.assign({}, query, { search: state[fieldName] })
      : query;
  };
}