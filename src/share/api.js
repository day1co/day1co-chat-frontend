import { SSE } from 'sse.js'

const AVAILABLE_TRANSPORT = new Set(['xhr', 'sse'])
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}
const api = (function() {
  let endpoint = '/.ai'
  let headers = DEFAULT_HEADERS

  async function wrappedFetch(uri, options = {}) {
    let _options = { ...options, headers }
    _options.headers = {
      ...headers,
      ...(options.headers ?? {})
    }
    const f = await fetch(endpoint + uri, _options)
    if(!f.ok)
      throw new Error(`Network Error: ${f.status} ${f.statusText}`)
    const d = await f.json()
    if(d?.error)
      throw new Error(`API Error: ${d.error}`)

    return d?.data ?? d
  }

  return {
    setEndpoint(_endpoint) {
      endpoint = _endpoint ?? endpoint
    },
    setHeaders(_headers = {}) {
      headers = {
        ...DEFAULT_HEADERS,
        ..._headers
      }
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
