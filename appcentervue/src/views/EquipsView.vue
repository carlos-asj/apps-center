<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import EquipsForm from './EquipsForm.vue'

  const router = useRouter()
  const equips = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const isHovering = ref(false)
  
  const isSaving = ref(false)
  const errorMessage = ref('')

  const showForm = ref(false)

  function openForm() {
    showForm.value = true
  }

  function closeForm() {
    showForm.value = false

    equipData.value = { desc: ''}
  }

  async function fetchEquipsData() {
    try {
      const response = await fetch('http://localhost:3000/equips');
      const responseBody = await response.json();

      equips.value = responseBody;
      isLoading.value = false;
    } catch (error) {
      error.value = 'Error loading data: '+ error.message
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchEquipsData();
  })
</script>

<template>
  <div class="container">
    <h1>Equipments list</h1>
    <p>
      <EquipsForm />
    </p>
    <div v-if="isLoading" class="loading">
      Loading equipments... 
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="equips?.data" class="responseBody">
      <v-hover v-slot="{ isHovering, props}">
        <v-card
        v-bind="props"
        :elevation="isHovering ? 5 : 10"
        class="rounded-xl">
          <v-table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Serial number</th>
                <th>MAC Address</th>
                <th>Local IP</th>
                <th>Public IP</th>
                <th>Client</th>
                <th>Created at</th>
                <th>Updated at</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="equip in equips.data" :key="equip.id" class="equip-card">
                <td>{{ equip.description }}</td>
                <td>{{ equip.serial_num }}</td>
                <td>{{ equip.mac }}</td>
                <td>{{ equip.ip_local }}</td>
                <td>{{ equip.ip_publico }}</td>
                <td>{{ equip.client.name }}</td>
                <td>{{ new Date(equip.created_at).toLocaleString('pt-BR') }}</td>
                <td>{{ new Date(equip.updated_at).toLocaleString('pt-BR') }}</td>
              </tr>
            </tbody>

          </v-table>
        </v-card>
      </v-hover>
      
    </div>

    <div v-else class="sem-dados">
      Nenhum equipamento encontrado
    </div>

  </div>
</template>

<style scoped>
  .container {
    max-width: 2000px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  th {
    text-align: center;
    font-weight: bold;

    background-color: rgb(204, 204, 204);
  }

  td {
    text-align: center;
    font-size: small;

    border-bottom: 2px solid rgb(196, 196, 196);
  }

  .tbl {
    border-collapse: collapse;
  }

  .loading {
    text-align: center;
    padding: 40px;
    font-size: 1.2em;
    color: #666;
  }

  .error {
    background-color: #ffebee;
    color: #c62828;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #c62828;
  }

  .info-header {
    background-color: #e3f2fd;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .equipamento-card {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
  }

  .equipamento-card h3 {
    margin-top: 0;
    color: #2196f3;
    border-bottom: 2px solid #2196f3;
    padding-bottom: 10px;
  }

  .details h4 {
    color: #666;
    margin: 15px 0 5px 0;
  }

  .details p {
    margin: 5px 0;
    line-height: 1.5;
  }

  .details a {
    color: #2196f3;
    text-decoration: none;
    word-break: break-all;
  }

  .details a:hover {
    text-decoration: underline;
  }

  .datas {
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px dashed #ccc;
    color: #999;
  }

  .sem-dados {
    text-align: center;
    padding: 40px;
    background-color: #f5f5f5;
    border-radius: 8px;
    color: #666;
  }
</style>
