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

  > *:first-child
    margin-top: 0

  > *:last-child
    margin-bottom: 0

  > ul, > ol
    margin-left: -1em

  ul, ol
    padding-left: 1em

  li
    list-style: initial !important
    margin: 0

  li > p:first-child
    margin: 0

</style>
