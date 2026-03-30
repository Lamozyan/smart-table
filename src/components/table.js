import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);
  
  // Убеждаемся, что elements существует
  if (!root.elements) {
    root.elements = {};
  }
  
  // Добавляем дополнительные шаблоны
  if (before && before.length) {
    before.reverse().forEach((subName) => {
      const subComponent = cloneTemplate(subName);
      root[subName] = subComponent;
      root.container.prepend(subComponent.container);
    });
  }
  
  if (after && after.length) {
    after.forEach((subName) => {
      const subComponent = cloneTemplate(subName);
      root[subName] = subComponent;
      root.container.append(subComponent.container);
    });
  }
  
  // Обработчики событий
  root.container.addEventListener("change", () => onAction());
  root.container.addEventListener("reset", () => {
    setTimeout(() => onAction());
  });
  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.submitter) {
      onAction(e.submitter);
    } else {
      onAction();
    }
  });
  
  const render = (data) => {
    // Находим контейнер для строк
    const rowsContainer = root.elements.rows || root.container.querySelector('[data-name="rows"]');
    
    if (!rowsContainer) {
      console.error("Rows container not found");
      return;
    }
    
    if (!data || !data.length) {
      rowsContainer.replaceChildren();
      return;
    }
    
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      Object.keys(item).forEach((key) => {
        if (row.elements[key]) {
          row.elements[key].textContent = item[key];
        }
      });
      return row.container;
    });
    
    rowsContainer.replaceChildren(...nextRows);
  };
  
  return { ...root, render };
}