import "./fonts/ys-display/fonts.css";
import "./style.css";
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initTable } from "./components/table.js";
import { initSearching } from "./components/searching.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initPagination } from "./components/pagination.js";

// 1. Вызов initData(sourceData) присваиваем константе API
const api = initData([]);

function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);
  return { ...state, rowsPerPage, page };
}

// 2. Функция render для загрузки и отображения данных
async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let query = {}; // здесь будут формироваться параметры запроса
  
  // Применяем все фильтры и сортировки в правильном порядке
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action); // применяем фильтрацию
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action); // применяем пагинацию

  console.log("Query before getRecords:", query);
  
  try {
    const { total, items } = await api.getRecords(query); // запрашиваем данные с собранными параметрами
    
    updatePagination(total, query); // перерисовываем пагинатор на основе полученного total
    sampleTable.render(items); // отображаем полученные данные
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Инициализация таблицы
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// Инициализация пагинации - получаем обе функции
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

// Инициализация сортировки
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// Инициализация фильтрации - получаем обе функции
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);

// Инициализация поиска
const applySearching = initSearching(sampleTable.search.elements);

// Добавление в DOM
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

// 3. Асинхронная функция init для загрузки начальных данных
async function init() {
  const indexes = await api.getIndexes(); // получаем индексы (продавцы и покупатели)
  
  // Обновляем фильтры полученными данными о продавцах
  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
  });
  
  await render(); // выполняем первый рендер
}

// Запускаем приложение
init();