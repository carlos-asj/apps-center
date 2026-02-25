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
        <h2>Equipamentos</h2>
        <div>
          <!-- Botão com link direto -->
          <router-link to="/equipments">
            Ver Equipamentos
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>