export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      if (elements[elementName]) {
        // Очищаем существующие опции, кроме первой (пустой)
        while (elements[elementName].options.length > 1) {
          elements[elementName].remove(1);
        }
        
        // Добавляем новые опции из полученных индексов
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

    // Формируем фильтры на основе заполненных полей
    const filter = {};
    
    Object.keys(elements).forEach(key => {
      const element = elements[key];
      if (element && ['INPUT', 'SELECT'].includes(element.tagName) && element.value) {
        // Для полей ввода и селектов с непустыми значениями формируем параметр фильтра
        filter[`filter[${element.name}]`] = element.value;
      }
    });

    // Возвращаем query с добавленными фильтрами, если они есть
    return Object.keys(filter).length 
      ? Object.assign({}, query, filter) 
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}