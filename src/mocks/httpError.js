export function httpError(status, detail, extra = {}) {
  const error = new Error(detail)
  error.response = {
    status,
    data: {
      title: statusTitle(status),
      status,
      detail,
      ...extra,
    },
  }
  return error
}

function statusTitle(status) {
  if (status === 400) return 'Bad Request'
  if (status === 404) return 'Not Found'
  if (status === 409) return 'Conflict'
  return 'Error'
}
