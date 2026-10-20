import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Columns3, Filter, RotateCcw, SlidersHorizontal, X } from "lucide-react";

const COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const WIDTHS = [120, 160, 200, 260, 340];
const BTN = "inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border border-white/10 px-3 text-xs font-medium text-zinc-300 hover:border-white/20 hover:text-white disabled:opacity-30";
const FIELD = "h-9 w-full min-w-0 rounded-lg border border-white/10 bg-[#090909] px-3 text-xs text-white outline-none focus:border-white/30";

function textFromNode(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join(" ");
  if (React.isValidElement(node)) return textFromNode(node.props.children);
  return "";
}
function valueFor(row, column) {
  if (typeof column.filterValue === "function") return column.filterValue(row);
  if (row?.[column.key] != null && typeof row[column.key] !== "object") return row[column.key];
  const rendered = typeof column.render === "function" ? column.render(row) : null;
  return typeof rendered === "string" || typeof rendered === "number" ? rendered : textFromNode(rendered);
}
function cellFor(row, column) {
  return column.render ? column.render(row) : row?.[column.key] ?? "—";
}
function rowId(row, index) {
  return row?._id || row?.payoutId || row?.customerId || row?.accountId ||
    row?.orderId || row?.conversationId || row?.dealId || index;
}
function readSettings(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    if (v && typeof v === "object" && !Array.isArray(v)) return {
      order: Array.isArray(v.order) ? v.order.filter(x => typeof x === "string") : [],
      hidden: Array.isArray(v.hidden) ? v.hidden.filter(x => typeof x === "string") : [],
      widths: v.widths && typeof v.widths === "object" ? v.widths : {},
      density: v.density === "compact" ? "compact" : "comfortable",
    };
  } catch { /* Storage can be unavailable or contain an older schema. */ }
  return { order: [], hidden: [], widths: {}, density: "comfortable" };
}

export default function AdminDataGrid({
  columns = [], rows = [], onRow, empty = "No records found.",
  tableId = "records", serverPaged = false,
}) {
  const settingsKey = "acg-admin-grid-v1:" + tableId;
  const [settings, setSettings] = useState(() => readSettings(settingsKey));
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});
  const [sort, setSort] = useState({ key: "", direction: "asc" });
  const [localPage, setLocalPage] = useState(1);
  const [localSize, setLocalSize] = useState(25);
  const viewport = useRef(null);

  // Only layout preferences (not client/customer records) are stored in this browser.
  useEffect(() => {
    try { localStorage.setItem(settingsKey, JSON.stringify(settings)); }
    catch { /* Private browsing should still work without persistence. */ }
  }, [settingsKey, settings]);

  const columnOrder = useMemo(() => {
    const byKey = new Map(columns.map(c => [c.key, c]));
    return [
      ...settings.order.filter(key => byKey.has(key)).map(key => byKey.get(key)),
      ...columns.filter(c => !settings.order.includes(c.key)),
    ];
  }, [columns, settings.order]);

  // Never hide the identity column or status in the mobile record header.
  const identityColumn = columns[0];
  const statusColumn = columns.find(c => c.key === "status");
  const visible = columnOrder.filter(c =>
    c.key === identityColumn?.key || !settings.hidden.includes(c.key));
  const activeFilters = Object.entries(columnFilters).filter(([key, value]) =>
    columns.some(c => c.key === key) && String(value || "").trim());
  const activeFilterCount = activeFilters.length;
  const filtered = useMemo(() => {
    const byKey = new Map(columns.map(c => [c.key, c]));
    const narrowed = activeFilters.length
      ? rows.filter(row => activeFilters.every(([key, term]) =>
          String(valueFor(row, byKey.get(key)) ?? "").toLocaleLowerCase()
            .includes(String(term).trim().toLocaleLowerCase())))
      : rows;
    if (!sort.key) return narrowed;
    const column = byKey.get(sort.key);
    if (!column) return narrowed;
    const multiplier = sort.direction === "desc" ? -1 : 1;
    return [...narrowed].sort((a, b) => {
      const av = valueFor(a, column);
      const bv = valueFor(b, column);
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * multiplier;
      return COLLATOR.compare(String(av ?? ""), String(bv ?? "")) * multiplier;
    });
  }, [rows, columns, sort.key, sort.direction, columnFilters]);

  const localPages = Math.max(1, Math.ceil(filtered.length / localSize));
  const currentLocalPage = Math.min(localPage, localPages);
  const pageRows = serverPaged ? filtered : filtered.slice(
    (currentLocalPage - 1) * localSize, currentLocalPage * localSize);

  const firstKey = identityColumn?.key;
  const updateSettings = patch => setSettings(previous => ({ ...previous, ...patch }));
  const resetView = () => setSettings({ order: [], hidden: [], widths: {}, density: "comfortable" });
  const moveColumn = (key, delta) => {
    const keys = columnOrder.map(c => c.key);
    const index = keys.indexOf(key);
    const target = index + delta;
    if (index < 0 || target < 1 || target >= keys.length || key === firstKey) return;
    [keys[index], keys[target]] = [keys[target], keys[index]];
    updateSettings({ order: keys });
  };
  const updateFilter = (key, value) => {
    setColumnFilters(previous => ({ ...previous, [key]: value }));
    setLocalPage(1);
    if (viewport.current) viewport.current.scrollTop = 0;
  };
  const updateSort = key => {
    setSort(previous => ({
      key, direction: previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
    setLocalPage(1);
    if (viewport.current) viewport.current.scrollTop = 0;
  };
  const goToPage = page => {
    setLocalPage(Math.max(1, Math.min(localPages, page)));
    if (viewport.current) viewport.current.scrollTop = 0;
  };
  const compact = settings.density === "compact";
  const controlsShown = columns.length > 0;
  const openRow = row => { if (onRow) onRow(row); };

  return (
    <section className="min-w-0 space-y-2" aria-label={tableId.replaceAll("-", " ") + " data grid"}>
      {controlsShown && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-[#0e0e0e] px-3 py-2">
          <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-400">
            <SlidersHorizontal size={14} className="shrink-0" />
            <span>{filtered.length.toLocaleString()} {serverPaged ? "matching on this page" : "matching records"}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={BTN + (filtersOpen ? " border-white/30 text-white" : "")}
              onClick={() => setFiltersOpen(v => !v)} aria-expanded={filtersOpen} aria-controls={"grid-filters-" + tableId}>
              <Filter size={13} /> Filters{activeFilterCount ? " (" + activeFilterCount + ")" : ""}
            </button>
            <button type="button" className={BTN + (columnsOpen ? " border-white/30 text-white" : "")}
              onClick={() => setColumnsOpen(v => !v)} aria-expanded={columnsOpen} aria-controls={"grid-columns-" + tableId}>
              <Columns3 size={13} /> Columns
            </button>
          </div>
        </div>
      )}

      {filtersOpen && (
        <div id={"grid-filters-" + tableId} className="rounded-xl border border-white/10 bg-[#101010] p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-white">Filter by column</p>
            <button type="button" className={BTN} onClick={() => { setColumnFilters({}); setLocalPage(1); }}>Clear filters <X size={13} /></button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {columns.map(col => (
              <label key={col.key} className="min-w-0 space-y-1">
                <span className="block text-[11px] text-zinc-400">{col.label}</span>
                <input type="search" className={FIELD} value={columnFilters[col.key] || ""}
                  onChange={e => updateFilter(col.key, e.target.value)}
                  placeholder={"Contains…"} />
              </label>
            ))}
          </div>
          {serverPaged && <p className="mt-3 text-[11px] leading-5 text-amber-200/80">These column filters search loaded rows on this page only. Use the main search and status controls to query all records on the server.</p>}
        </div>
      )}

      {columnsOpen && (
        <div id={"grid-columns-" + tableId} className="rounded-xl border border-white/10 bg-[#101010] p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-white">Customize columns</p>
            <button type="button" onClick={resetView} className={BTN}><RotateCcw size={13} /> Reset</button>
          </div>
          <div className="max-h-[min(44dvh,420px)] space-y-1 overflow-y-auto overscroll-contain">
            {columnOrder.map((col, index) => (
              <div key={col.key} className="flex min-w-0 flex-wrap items-center gap-2 rounded-lg border border-white/[0.05] px-2 py-2">
                <label className="flex min-w-[125px] flex-1 items-center gap-2 text-xs text-zinc-300">
                  <input type="checkbox" className="size-4 accent-white" checked={!settings.hidden.includes(col.key)}
                    disabled={col.key === firstKey}
                    onChange={e => updateSettings({ hidden: e.target.checked
                      ? settings.hidden.filter(key => key !== col.key)
                      : [...settings.hidden, col.key] })} />
                  <span className="truncate">{col.label}</span>
                </label>
                <label className="flex items-center gap-1 text-[11px] text-zinc-500">
                  Width
                  <select aria-label={"Width of " + col.label} className="h-8 rounded-md border border-white/10 bg-[#090909] px-1 text-xs text-zinc-300"
                    value={WIDTHS.includes(settings.widths[col.key]) ? settings.widths[col.key] : 160}
                    onChange={e => updateSettings({ widths: { ...settings.widths, [col.key]: Number(e.target.value) } })}>
                    {WIDTHS.map(width => <option key={width} value={width}>{width}px</option>)}
                  </select>
                </label>
                <button type="button" className={BTN + " min-h-8 px-2"}
                  aria-label={"Move " + col.label + " left"} disabled={index <= 1 || col.key === firstKey}
                  onClick={() => moveColumn(col.key, -1)}><ArrowUp size={13} /></button>
                <button type="button" className={BTN + " min-h-8 px-2"}
                  aria-label={"Move " + col.label + " right"} disabled={index === columnOrder.length - 1 || col.key === firstKey}
                  onClick={() => moveColumn(col.key, 1)}><ArrowDown size={13} /></button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
            <span className="text-[11px] text-zinc-500">Layout is saved on this device. First column stays visible.</span>
            <button type="button" className={BTN}
              onClick={() => updateSettings({ density: compact ? "comfortable" : "compact" })}>
              {compact ? "Comfortable rows" : "Compact rows"}
            </button>
          </div>
        </div>
      )}

      {/* Mobile uses a viewport-scrolling card collection; desktop keeps sticky headers and a frozen identity column. */}
      <div ref={viewport} className="max-h-[min(65dvh,740px)] min-w-0 overflow-auto overscroll-contain rounded-xl border border-white/[0.07] bg-[#0f0f0f]">
        <div className="space-y-2 p-2 md:hidden" aria-label="Records">
          {pageRows.map((row, index) => (
            <article key={rowId(row, index)} className="min-w-0 rounded-xl border border-white/[0.08] bg-[#101010] p-3.5">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">{identityColumn?.label}</p>
                  <div className="mt-1 break-words text-[13px] font-semibold text-white [overflow-wrap:anywhere]">
                    {identityColumn ? cellFor(row, identityColumn) : "—"}
                  </div>
                </div>
                {(statusColumn || onRow) && <div className="flex shrink-0 flex-col items-end gap-2">
                  {statusColumn && <div aria-label="Record status" className="max-w-[120px] break-words text-right">{cellFor(row, statusColumn)}</div>}
                  {onRow && <button type="button" onClick={() => openRow(row)}
                    aria-label={"Open " + (identityColumn?.label || "record") + " details"}
                    className={BTN + " min-h-10"}>Open <ChevronRight size={14} /></button>}
                </div>}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-white/[0.06] pt-3">
                {visible.filter(c => c.key !== identityColumn?.key && c.key !== statusColumn?.key).slice(0, 4).map(col => (
                  <div key={col.key} className="min-w-0">
                    <dt className="text-[10px] text-zinc-500">{col.label}</dt>
                    <dd className="mt-1 break-words text-xs text-zinc-200 [overflow-wrap:anywhere]">{cellFor(row, col)}</dd>
                  </div>
                ))}
              </dl>
              {visible.filter(c => c.key !== identityColumn?.key && c.key !== statusColumn?.key).length > 4 && (
                <details className="mt-3 border-t border-white/[0.06] pt-2">
                  <summary className="cursor-pointer py-2 text-xs font-medium text-zinc-400">
                    More fields ({visible.filter(c => c.key !== identityColumn?.key && c.key !== statusColumn?.key).length - 4})
                  </summary>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-3 pt-2">
                    {visible.filter(c => c.key !== identityColumn?.key && c.key !== statusColumn?.key).slice(4).map(col => (
                      <div key={col.key} className="min-w-0">
                        <dt className="text-[10px] text-zinc-500">{col.label}</dt>
                        <dd className="mt-1 break-words text-xs text-zinc-200 [overflow-wrap:anywhere]">{cellFor(row, col)}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              )}
            </article>
          ))}
        </div>
        <table className="hidden min-w-full border-separate border-spacing-0 text-left text-xs md:table">
          <thead className="sticky top-0 z-20 bg-[#161616] text-[10px] uppercase tracking-wider text-zinc-400">
            <tr>{visible.map((col, index) => (
              <th key={col.key} scope="col" style={{ minWidth: settings.widths[col.key] || 160, width: settings.widths[col.key] || 160 }}
                className={"border-b border-r border-white/[0.07] bg-[#161616] px-3 py-2 font-medium " +
                  (index === 0 ? "sticky left-0 z-30" : "")}>
                <button type="button" onClick={() => updateSort(col.key)}
                  aria-label={"Sort by " + col.label} aria-sort={undefined}
                  className="flex w-full items-center justify-between gap-2 text-left hover:text-white">
                  <span className="truncate">{col.label}</span>
                  {sort.key === col.key
                    ? sort.direction === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    : <ArrowUpDown size={12} className="opacity-40" />}
                </button>
              </th>
            ))}</tr>
          </thead>
          <tbody>
            {pageRows.map((row, index) => (
              <tr key={rowId(row, index)} onClick={onRow ? () => openRow(row) : undefined}
                onKeyDown={onRow ? e => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openRow(row); } } : undefined}
                tabIndex={onRow ? 0 : undefined}
                className={onRow ? "cursor-pointer hover:bg-white/[0.035] focus:outline focus:outline-1 focus:outline-white/30" : ""}>
                {visible.map((col, indexCol) => (
                  <td key={col.key} style={{ minWidth: settings.widths[col.key] || 160, width: settings.widths[col.key] || 160 }}
                    className={"border-b border-r border-white/[0.04] px-3 text-zinc-300 " +
                      (compact ? "py-1.5 " : "py-3 ") +
                      (indexCol === 0 ? "sticky left-0 z-10 bg-[#101010]" : "")}>
                    <div className="max-w-[340px] break-words [overflow-wrap:anywhere]">{cellFor(row, col)}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!pageRows.length && (
          <div className="px-5 py-12 text-center text-xs text-zinc-500">
            {rows.length ? "No matching rows. Clear column filters to see more." : empty}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
        <span>{serverPaged ? "Loaded-page operations" : "Local table"} · {filtered.length.toLocaleString()} matching</span>
        <div className="flex items-center gap-2">
          {!serverPaged && (
            <>
              <label className="flex items-center gap-1">Rows
                <select aria-label="Local rows per page" value={localSize}
                  className="h-8 rounded-md border border-white/10 bg-[#0b0b0b] px-1 text-zinc-300"
                  onChange={e => { setLocalSize(Number(e.target.value)); goToPage(1); }}>
                  {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
              <span>{currentLocalPage}/{localPages}</span>
              <button type="button" aria-label="Previous local page" className={BTN + " px-2"} disabled={currentLocalPage <= 1}
                onClick={() => goToPage(currentLocalPage - 1)}><ChevronLeft size={14} /></button>
              <button type="button" aria-label="Next local page" className={BTN + " px-2"} disabled={currentLocalPage >= localPages}
                onClick={() => goToPage(currentLocalPage + 1)}><ChevronRight size={14} /></button>
            </>
          )}
          {(sort.key || activeFilterCount > 0) && <button type="button" className={BTN}
            onClick={() => { setSort({ key: "", direction: "asc" }); setColumnFilters({}); setLocalPage(1); }}>
            <RotateCcw size={12} /> Clear sort/filter
          </button>}
        </div>
      </div>
    </section>
  );
}
