export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      if (elements[elementName]) {
        // Очищаем существующие опции, кроме первой
        while (elements[elementName].options.length > 1) {
          elements[elementName].remove(1);
        }
        
        Object.values(indexes[elementName]).forEach((name) => {
          const el = document.createElement("option");
          el.textContent = name;
          el.value = name;
          elements[elementName].appendChild(el);
        });
      }
    });
  };

  const applyFiltering = (query, state, action) => {
    // Обработка очистки поля
    if (action && action.name === "clear") {
      const fieldName = action.getAttribute("data-field");
      const input = document.querySelector(`[data-name="searchBy${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}"]`);
      if (input) {
        input.value = "";
      }
    }

    // Формируем фильтры
    const filter = {};
    
    if (elements.searchByDate && elements.searchByDate.value) {
      filter['filter[date]'] = elements.searchByDate.value;
    }
    if (elements.searchByCustomer && elements.searchByCustomer.value) {
      filter['filter[customer]'] = elements.searchByCustomer.value;
    }
    if (elements.searchBySeller && elements.searchBySeller.value) {
      filter['filter[seller]'] = elements.searchBySeller.value;
    }
    if (elements.totalFrom && elements.totalFrom.value) {
      filter['filter[total][from]'] = elements.totalFrom.value;
    }
    if (elements.totalTo && elements.totalTo.value) {
      filter['filter[total][to]'] = elements.totalTo.value;
    }

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}