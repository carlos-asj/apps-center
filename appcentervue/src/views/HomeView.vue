<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Função para navegar programaticamente
function irParaEquipamentos() {
  router.push('/equipments')
}
</script>
<template>
  <div class="home-container">
    <div>
      <div>
        <h1>HOME</h1>
        <div>
          Página inicial
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>