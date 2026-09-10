import React from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import EmptyState from './EmptyState';
import { SkeletonRow } from './LoadingState';

export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are currently no items matching your criteria.',
  sortColumn,
  sortDirection = 'asc',
  onSort,
  onRowClick,
  selectable = false,
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  idKey = 'id',
  className = '',
}) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className={`overflow-x-auto scrollbar-thin border border-slate-200/80 rounded-xl bg-white shadow-xs ${className}`}>
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <tr>
            {selectable && (
              <th className="px-4 py-3.5 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-blue-400 cursor-pointer"
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sortColumn === col.key;
              const canSort = col.sortable && onSort;
              return (
                <th
                  key={col.key}
                  onClick={() => canSort && onSort(col.key)}
                  className={`px-4 py-3.5 whitespace-nowrap ${
                    canSort ? 'cursor-pointer hover:bg-slate-100/70 select-none' : ''
                  } ${col.headerClassName || ''}`}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {canSort && (
                      <span className="text-slate-400">
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-primary" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading && (
            <>
              <SkeletonRow cols={columns.length + (selectable ? 1 : 0)} />
              <SkeletonRow cols={columns.length + (selectable ? 1 : 0)} />
              <SkeletonRow cols={columns.length + (selectable ? 1 : 0)} />
            </>
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="py-12 text-center"
              >
                <EmptyState title={emptyTitle} description={emptyDescription} compact />
              </td>
            </tr>
          )}

          {!loading &&
            data.map((row, idx) => {
              const isSelected = selectedIds.includes(row[idKey]);
              return (
                <tr
                  key={row[idKey] || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors duration-100 ${
                    onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/40'
                  } ${isSelected ? 'bg-blue-50/50' : ''}`}
                >
                  {selectable && (
                    <td
                      className="px-4 py-3.5 w-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectRow && onSelectRow(row[idKey], e.target.checked)}
                        className="rounded border-slate-300 text-primary focus:ring-blue-400 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 text-slate-700 whitespace-nowrap ${col.className || ''}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
