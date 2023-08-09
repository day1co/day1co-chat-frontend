import { SSE } from 'sse.js'

const api = (function() {
  let endpoint = '/.ai'
  let headers = {
    'Content-Type': 'application/json'
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
        return fetch(endpoint + '/history?' + query, {
          headers
        }).then(d => d.json())
      },
      get(id) {
        return fetch(endpoint + `/history/${id}`, {
          headers
        }).then(d => d.json())
      },
      create(context) {
        return fetch(endpoint + '/history', {
          method: 'POST',
          headers,
          body: JSON.stringify({ context })
        }).then(d => {
          if(d.ok)
            return d.json()
          else
            return d
        })
      },
      delete(id) {
        return fetch(endpoint + '/history/' + id, {
          method: 'DELETE',
          headers
        })
      }
    },
    message: {
      createEvent(context, question) {
        const source = new SSE(endpoint + '/message', {
          headers,
          payload: JSON.stringify({ question, context })
        })
        return source
      },
      feedback(messageId, feedback) {
        return fetch(endpoint + '/message/' + messageId, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ feedback })
        }).then(d => d.json())
      }
    }
  }
})()

export default api
