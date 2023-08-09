<template>
  <ul class="fcfc-list fcfc-list-history">
    <li class="fcfc-list-label"> 질문 기록 </li>
    <li class="fcfc-list-item" v-for="entry of history">
      {{ entry.question }}
      <button class="fcfc-list-action" @click="$emit('delete', entry.id)">
        <img class="fcfc-icon" src="../images/trash.svg" />
      </button>
    </li>
  </ul>
</template>

<script>

export default {
  props: {
    history: Array
  }
}

</script>

<style lang="sass">

@import ../styles/variables

.fcfc-list
  margin: 0
  padding: 1rem 1rem

  list-style: none

  background: white

  &-label
    font-size: 0.6875rem
    line-height: 1rem

    color: #6e6e73

  &-item
    @include clickable

    display: flex
    margin: 0.5rem 0
    padding: 0.75rem
    border: 1px solid #e6e8eb
    border-radius: 0.375rem

    font-size: 0.8125rem
    line-height: 1.5rem

    box-shadow: 0 0.2rem 0.5rem #202a4514

  &-flat > &-item
    background: #f2f2f2
    box-shadow: none

  &-action, &-icon
    vertical-align: top
    line-height: 0

  &-action
    margin: -0.875rem -0.875rem -0.875rem auto
    padding: 0.75rem 0.75rem 0.75rem 0.25rem

  &-history

    .fcfc-list

      &-item
        padding-left: 2rem
        background-image: url('../images/comment.svg')
        background-repeat: no-repeat
        background-size: 1.5rem
        background-position: 0.5rem center

</style>
