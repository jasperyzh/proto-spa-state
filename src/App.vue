<template>
  <div class="app">
    <QuizGame />
  </div>
</template>

<script setup lang="ts">
import QuizGame from './components/QuizGame.vue';
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  color: #333;
}

.app {
  min-height: 100vh;
  padding: 20px;
}
</style> 