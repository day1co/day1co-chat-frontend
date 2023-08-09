import { SSE } from 'sse.js'

const api = (function() {
  let endpoint = '/.ai'

  return {
    setEndpoint(_endpoint) {
      endpoint = _endpoint ?? endpoint
    },
    history: {
      list(context) {
        const query = new URLSearchParams(context)
        return fetch(endpoint + '/history?' + query).then(d => d.json())
      },
      get(id) {
        return fetch(endpoint + `/history/${id}`).then(d => d.json())
      },
      create(context) {
        return fetch(endpoint + '/history', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context })
        }).then(d => {
          if(d.ok)
            return d.json()
          else
            return d
        })
      },
      delete(id) {
        return fetch(endpoint + '/history/' + id, { method: 'DELETE' })
      }
    },
    message: {
      createEvent(context, question) {
        const source = new SSE(endpoint + '/message', {
          headers: { 'Content-Type': 'application/json' },
          payload: JSON.stringify({ question, context })
        })
        return source
      },
      feedback(msgid, feedback) {
        return fetch(endpoint + '/message/' + msgid, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedback })
        }).then(d => d.json())
      }
    }
  }
})()

export default api
