export function useListQuery({ query, fetchList, onError }) {
  async function runFetch() {
    try {
      await fetchList()
    } catch (error) {
      onError?.(error)
    }
  }

  function toggleSort(columnKey) {
    if (query.sortBy === columnKey) {
      query.sortDir = query.sortDir === 'asc' ? 'desc' : 'asc'
    } else {
      query.sortBy = columnKey
      query.sortDir = 'asc'
    }
    runFetch()
  }

  function changePage(page) {
    query.page = page
    runFetch()
  }

  return { toggleSort, changePage, runFetch }
}
