<template>
  <ul class="fcfc-chat-content fcfc-chat-content-links">
    <li v-for="link in content">
      <figure>
        <img :src="link.href" />
        <figcaption>
          <h5> {{ link.title }} </h5>
          <p> {{ link.href }} </p>
        </figcaption>
      </figure>
    </li>
  </ul>
</template>

<script>

export default {
  props: {
    content: Array
  }
}

</script>

<style lang="sass">

@import ../../styles/variables

.fcfc-chat-content-links
  display: flex
  list-style: none

  margin: 0 -1em 0 -3em
  padding: 0 0.5em 0 2.5em

  overflow-x: scroll
  scroll-snap-align: center
  scroll-snap-type: x mandatory

  > li
    width: 100%

  figure
    width: 100%
    margin: 0.5em

    background: white
    box-shadow: 0 0 0 1px #0008
    border-radius: 0.25em

    > img
      width: 100%
      height: 6em
      object-fit: cover

    > figcaption
      width: 100%
      padding: 0 0.5em 0.5em 0.5em
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
