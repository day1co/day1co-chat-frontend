<template>
  <div class="fcfc-chat-content fcfc-chat-content-markdown" v-html="renderedContent"></div>
</template>

<script>

import renderMarkdown from '../../share/renderer'

export default {
  props: {
    content: String
  },
  computed: {
    renderedContent() {
      return renderMarkdown(this.content ?? '')
    }
  }
}

</script>
