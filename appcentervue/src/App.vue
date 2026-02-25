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
  <div>
    <h1>Sistema de gestão de equipamentos</h1>
    <nav>
      <router-link to="/">Home</router-link> | 
      <router-link to="/equipments">Listar equipamentos</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>

</style>