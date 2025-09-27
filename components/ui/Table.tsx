'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

interface Column<T> {
  key: keyof T
  header: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  className?: string
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyMessage?: string
}

interface TableState {
  currentPage: number
  sortKey: string
  sortDirection: 'asc' | 'desc'
}

function Table<T extends Record<string, unknown>>({
  data,
  columns,
  sortable = false,
  pagination = false,
  pageSize = 10,
  className,
  onRowClick,
  loading = false,
  emptyMessage = "No data available"
}: TableProps<T>) {
  const [state, setState] = React.useState<TableState>({
    currentPage: 1,
    sortKey: String(columns[0]?.key) || '',
    sortDirection: 'asc'
  })

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortable || !state.sortKey) return data

    return [...data].sort((a, b) => {
      const aVal = a[state.sortKey] as any
      const bVal = b[state.sortKey] as any

      if (aVal < bVal) return state.sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return state.sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortable, state.sortKey, state.sortDirection])

  // Pagination logic
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData

    const startIndex = (state.currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, pagination, state.currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Handlers
  const handleSort = (key: keyof T) => {
    if (!sortable) return

    setState(prev => ({
      ...prev,
      sortKey: String(key),
      sortDirection: prev.sortKey === String(key) && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }))
  }

  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key]
    
    if (column.render) {
      return column.render(value, row)
    }

    return (
      <span className={cn(
        'truncate',
        column.align === 'center' && 'text-center',
        column.align === 'right' && 'text-right'
      )}>
        {String(value)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-10 bg-surface-2 rounded-t-lg mb-2"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-2 mb-2"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className={cn('table w-full', className)}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'cursor-pointer select-none transition-colors hover:bg-surface-2',
                    column.width && `w-${column.width}`,
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    !column.sortable && 'cursor-default hover:bg-transparent'
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={cn(
                    'flex items-center gap-2',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )}>
                    <span>{column.header}</span>
                    {column.sortable && state.sortKey === column.key && (
                      state.sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    'transition-colors hover:bg-surface-2',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="align-top">
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="text-sm text-muted">
            Showing {((state.currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(state.currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(state.currentPage - 1)}
              disabled={state.currentPage === 1}
              className="p-2 rounded-lg border border-border hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1
              const isCurrentPage = page === state.currentPage
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isCurrentPage
                      ? 'bg-primary text-white'
                      : 'border border-border hover:bg-surface-2'
                  )}
                >
                  {page}
                </button>
              )
            })}
            
            <button
              onClick={() => handlePageChange(state.currentPage + 1)}
              disabled={state.currentPage === totalPages}
              className="p-2 rounded-lg border border-border hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Table
