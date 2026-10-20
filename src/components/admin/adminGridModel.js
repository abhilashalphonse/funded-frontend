// Pure, testable data-grid operations. Remote datasets are paged by the admin API;
// this module never pretends loaded-page filtering covers the entire database.
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

export function orderColumns(columns, preference = {}) {
  const order = Array.isArray(preference.order) ? preference.order : [];
  const byKey = new Map(columns.map(column => [column.key, column]));
  return [
    ...order.filter(key => byKey.has(key)).map(key => byKey.get(key)),
    ...columns.filter(column => !order.includes(column.key)),
  ];
}

export function applyGridOperations(rows, columns, filters = {}, sort = {}, valueFor) {
  const byKey = new Map(columns.map(column => [column.key, column]));
  const activeFilters = Object.entries(filters).filter(([key, term]) =>
    byKey.has(key) && String(term ?? "").trim() !== "");
  const matching = activeFilters.length
    ? rows.filter(row => activeFilters.every(([key, term]) =>
      String(valueFor(row, byKey.get(key)) ?? "").toLocaleLowerCase()
        .includes(String(term).trim().toLocaleLowerCase())))
    : rows;
  if (!sort.key || !byKey.has(sort.key)) return matching;
  const col = byKey.get(sort.key);
  const direction = sort.direction === "desc" ? -1 : 1;
  return [...matching].sort((a, b) => {
    const av = valueFor(a, col);
    const bv = valueFor(b, col);
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * direction;
    return collator.compare(String(av ?? ""), String(bv ?? "")) * direction;
  });
}

export function pageLocalRows(rows, page, pageSize) {
  const limit = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 25;
  const pages = Math.max(1, Math.ceil(rows.length / limit));
  const currentPage = Math.min(pages, Math.max(1, Number(page) || 1));
  return { pages, currentPage, rows: rows.slice((currentPage - 1) * limit, currentPage * limit) };
}

export function pageRange(pagination) {
  const current = Math.max(1, Number(pagination?.page) || 1);
  const limit = Math.max(1, Number(pagination?.limit) || 25);
  const total = Math.max(0, Number(pagination?.total) || 0);
  return {
    from: total === 0 ? 0 : (current - 1) * limit + 1,
    to: Math.min(total, current * limit),
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}
