<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const rotaAtual = computed(() => route.path)

function isActive(path) {
  return rotaAtual.value === path
}
</script>

<template>
  <div class="app">
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

.main {
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
}

</style>