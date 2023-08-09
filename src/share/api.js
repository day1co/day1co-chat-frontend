import { SSE } from 'sse.js'

export default {
  history: {
    list(context) {
      const query = new URLSearchParams(context)
      return fetch('/.api/history?' + query).then(d => d.json())
    },
    get(id) {
      return fetch(`/.api/history/${id}`).then(d => d.json())
    },
    create(context) {
      return fetch('/.api/history', {
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
      return fetch('/.api/history/' + id, { method: 'DELETE' })
    }
  },
  message: {
    createEvent(context, question) {
      const source = new SSE('/.api/message', {
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify({ question, context })
      })
      return source
    },
    feedback(msgid, feedback) {
      return fetch('/.api/message/' + msgid, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      }).then(d => d.json())
    }
  }
}
