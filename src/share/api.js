import { SSE } from 'sse.js'

const AVAILABLE_TRANSPORT = new Set(['xhr', 'sse'])

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
      createEvent(chatId, question) {
        const source = new SSE(endpoint + `/messages/${chatId}?mode=sse`, {
          method: 'POST',
          headers,
          payload: JSON.stringify({ chatId, question })
        })
        return source
      },
      ask(chatId, question) {
        return wrappedFetch(`/messages/${chatId}?mode=xhr`, {
          method: 'POST',
          body: JSON.stringify({ question })
        })
      },
      feedback(chatId, messageId, feedback) {
        return wrappedFetch(`/messages/${chatId}/${messageId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ feedback })
        })
      }
    }
  }
})()

export default api
