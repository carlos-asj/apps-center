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
    <nav
    :class="['sidebar', { 'sidebar-expanded': isExpanded }]"
    class="elevation-3
    v-expand-transition"
    >
      <div class="sidebar-header">
        <button
        @click="toggleSidebar"
        :class="['toggle-btn', {'toggle-btn-expanded': isExpanded}]">
          <span v-if="isExpanded">⭐</span>
          <span v-else>⭐</span>
        </button>
        <span v-if="isExpanded" class="logo-icon"></span>
        <h3 v-if="isExpanded"
        class="logo-text v-expand-transition"
        style="position: fixed;">Ayel</h3>
      </div>
      <ul class="sidebar-menu">
        <li>
          <router-link
          :to="'/'"
          class="menu-item">
            <span class="menu-icon">🏠</span>
            <span v-if="isExpanded" class="menu-text">Home</span>
          </router-link>
        </li>
        <li>
          <router-link
          to="/equipments"
          class="menu-item">
            <span class="menu-icon">📡</span>
            <span v-if="isExpanded" class="menu-text">Equipments List</span>
          </router-link>
        </li>
      </ul>

      <div class="sidebar-footer" v-if="isExpanded">

      </div>
      <div class="sidebar-footer" v-else>

      </div>
    </nav>
    <main :class="['content', { 'content-expanded': isExpanded}]">
      <div>
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isExpanded: false,
    }
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

.app {
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.sidebar {
  background-color: #f9f9f9;
  transition: width 0.3s ease;
  width: 60px;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar-expanded {
  width: 250px;
}

.sidebar-header {
  white-space: nowrap;
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
  color: black;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  border-radius: 5px;
  min-width: 30px;
}

.toggle-btn-expanded {
  margin-left: 190px;
}

.logo-text {
  margin-left: 0;
}

.logo-icon {
  margin-left: 10px;
  font-size: 24px;
}

/* Menu */
.sidebar-menu {
  list-style: none;
  padding: 10px 0;
  flex-grow: 1;
}

.menu-item {
  color: black;
  text-decoration: none;
  display: block;
  padding: 15px;
  white-space: nowrap;
}

.menu-item:hover {
  background-color: #e8e8e8;
}

.menu-item.active {
  background: black;
  color: white;
}

.menu-item.active .menu-icon {
  color: white;
}

.menu-icon {
  font-size: 20px;
  min-width: 30px;
  text-align: center;
}

.menu-text {
  margin-left: 15px;
  font-size: 14px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Conteúdo principal */
.content {
  color: black;
  flex: 1;
  margin-left: 70px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
}

.content-expanded {
  margin-left: 260px;
}

.content-header {
  background: white;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.content-header h1 {
  margin-bottom: 10px;
}

.content-header p {
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .content {
    margin-left: 70px;
  }
  
  .content-expanded {
    margin-left: 250px;
  }

}

</style>