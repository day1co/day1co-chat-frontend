<template>
  <ul class="fcfc-chat-content fcfc-chat-content-links">
    <li v-for="link in content">
      <a :href="getLink(link)" target="_blank">
        <figure>
          <img v-if="link.href ?? link.uri" :src="link.href ?? link.uri" />
          <figcaption>
            <h5> {{ link.title ?? link.text }} </h5>
            <p> {{ getLink(link) }} </p>
          </figcaption>
        </figure>
      </a>
    </li>
  </ul>
</template>

<script>

export default {
  props: {
    content: Array
  },
  methods: {
    getLink(item) {
      return item.href ?? item.url ?? item.actions?.[0]?.uri
    }
  }
}

</script>

<style lang="sass">

@import ../../styles/variables

.fcfc-chat-content-links
  display: flex
  align-items: flex-end
  list-style: none

  margin: 0 -1em 0 -3em
  padding: 0 0.5em 0 2.5em

  overflow-x: auto
  scroll-snap-align: center
  scroll-snap-type: x mandatory
  user-select: none

  > li
    width: 80%
    max-width: 36em

    > a
      color: inherit
      text-decoration: none

  figure
    width: calc(100% - 1em)
    margin: 0.5em

    background: white
    box-shadow: 0 0 0 1px #0008
    border-radius: 0.25em

    > img
      width: 100%
      height: 6em
      object-fit: cover

      + figcaption
        margin-top: -0.5em

    > figcaption
      width: 100%
      padding: 0.5em
      line-height: 1.25em


      > h5, > p
        font-weight: inherit
        font-size: 0.875em
        margin: 0

        white-space: nowrap
        word-break: keep-all
        overflow-x: hidden
        text-overflow: ellipsis

      > p
        color: #0009

</style>
