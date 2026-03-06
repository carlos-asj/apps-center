<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

<<<<<<< Updated upstream
import Sidebar from './components/Sidebar.vue';
=======
import Sidebar from './components/sidebar/Sidebar.vue';
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
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
=======
<script>
</script>

<template>
  <Sidebar />
  <div
  style="margin-left: 90px;">
    <router-view />
  </div>
  
</template>

<style>
* {
    background-color: white;
    color:black
>>>>>>> Stashed changes
}
</style>