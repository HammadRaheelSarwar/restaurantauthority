import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ChevronDown } from 'lucide-react';
import EmptyState from './EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  filters = null,
  actions = null,
  pagination = true,
  pageSize = 10,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records matching your current filter criteria.',
  onRowClick = null,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter((row) => {
      if (searchKeys.length > 0) {
        return searchKeys.some((key) => {
          const val = row[key];
          return val && String(val).toLowerCase().includes(term);
        });
      }
      // Fallback: search all string / number fields in the row
      return Object.values(row).some((val) => {
        return val && String(val).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchKeys]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const handleSort = (key) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-[#E6ECE8] shadow-sm overflow-hidden ${className}`}>
      {/* Table Toolbar */}
      {(searchable || filters || actions) && (
        <div className="p-4 border-b border-[#E6ECE8] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {searchable && (
              <div className="relative min-w-[220px] max-w-sm w-full">
                <Search className="w-4 h-4 text-[#66736B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F7F9F8] border border-[#E6ECE8] rounded-lg text-[#17231D] placeholder-[#66736B] focus:outline-none focus:ring-2 focus:ring-[#146B45] focus:bg-white transition"
                />
              </div>
            )}
            {filters}
          </div>

          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}

      {/* Table Data */}
      {paginatedData.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} className="border-0 rounded-none my-4" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F7F9F8] text-[#66736B] font-semibold border-b border-[#E6ECE8]">
                {columns.map((col) => {
                  const isSorted = sortKey === col.key;
                  return (
                    <th
                      key={col.key || col.label}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px] ${
                        col.sortable ? 'cursor-pointer hover:text-[#17231D] select-none' : ''
                      } ${col.className || ''}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.label}</span>
                        {col.sortable && (
                          <ArrowUpDown className={`w-3 h-3 ${isSorted ? 'text-[#146B45]' : 'text-[#CBD5CD]'}`} />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECE8]">
              {paginatedData.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition hover:bg-[#F7F9F8]/80 ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key || col.label} className={`py-3.5 px-4 text-[#17231D] ${col.className || ''}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Pagination */}
      {pagination && sortedData.length > pageSize && (
        <div className="p-3.5 px-4 border-t border-[#E6ECE8] flex items-center justify-between text-xs text-[#66736B] bg-[#F7F9F8]/50">
          <div>
            Showing <strong className="text-[#17231D]">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-[#17231D]">{Math.min(currentPage * pageSize, sortedData.length)}</strong> of{' '}
            <strong className="text-[#17231D]">{sortedData.length}</strong> results
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#E6ECE8] bg-white text-[#17231D] hover:bg-[#F7F9F8] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-medium text-[#17231D]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#E6ECE8] bg-white text-[#17231D] hover:bg-[#F7F9F8] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
