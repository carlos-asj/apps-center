<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import Sidebar from './components/Sidebar.vue';

const route = useRoute()

const rotaAtual = computed(() => route.path)

function isActive(path) {
  return rotaAtual.value === path
}
</script>
<script>
  export default {
    components: { Sidebar },
    setup() {
      return {

      }
    }
  }
</script>

<template>
  <div class="container">
    <Sidebar />
      <div>
        <router-view />
      </div>
  </div>
</template>

<style>
* {
  background-color: var(--sidebar-bg-color);
  color: black;
}
</style>

<style scoped>
.container {
  margin-left: 80px;
}
</style>