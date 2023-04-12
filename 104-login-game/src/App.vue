<template>
  <canvas id="game">
  </canvas>
</template>

<script>
import { loadGame } from './game'
export default {
  name: 'Game',
  mounted () {
    loadGame('#game')
  }
}
</script>
