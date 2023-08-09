
export default {
  history: {
    get(context) {
      const query = new URLSearchParams(context)
      return fetch('/.api/history?' + query).then(d => d.json())
    },
    put(context, question) {
      return fetch('/.api/history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context })
      }).then(d => {
        if(d.ok)
          return d.json()
        else if(d.status === 409)
          return null
        else
          return d
      })
    },
    delete(id) {
      return fetch('/.api/history/' + id, { method: 'DELETE' })
    }
  }
}
