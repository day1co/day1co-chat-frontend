import { SSE } from 'sse.js'

const api = (function() {
  let endpoint = '/.ai'
  let headers = {
    'Content-Type': 'application/json'
  }

  function wrappedFetch(uri, options = {}) {
    let _options = { ...options, headers }
    _options.headers = {
      ...headers,
      ...(options.headers ?? {})
    }
    return fetch(endpoint + uri, _options)
      .then(d => d.ok? d.json() : d)
      .then(d => d?.data ?? d)
  }

  return {
    setEndpoint(_endpoint) {
      endpoint = _endpoint ?? endpoint
    },
    setToken(token) {
      if(token)
        headers.Authorization = `bearer ${token}`
      else
        delete headers.Authorization
    },
    history: {
      list(context) {
        const query = new URLSearchParams(context)
        return wrappedFetch('/history?' + query)
      },
      get(id) {
        return wrappedFetch(`/history/${id}`)
      },
      create(context) {
        return wrappedFetch('/history', {
          method: 'POST',
          body: JSON.stringify({ context })
        })
      },
      delete(id) {
        return wrappedFetch('/history/' + id, {
          method: 'DELETE'
        })
      }
    },
    message: {
      createEvent(context, question) {
        const source = new SSE('/message', {
          payload: JSON.stringify({ question, context })
        })
        return source
      },
      feedback(messageId, feedback) {
        return wrappedFetch('/message/' + messageId, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ feedback })
        })
      }
    }
  }
})()

export default api
