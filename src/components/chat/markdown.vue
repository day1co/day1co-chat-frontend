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

<style lang="sass">

.fcfc-chat-content-markdown
  margin-top: -1em

</style>
