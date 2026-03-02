<script setup>
    import { ref } from 'vue'

    const showForm = ref(false)
    const isSaving = ref(false)
    const errorMessage = ref('')
    const equipData = ref({
        description: '',
        serial_num: '',
        link_rtsp: '',
        mac: '',
        ip_local: '',
        ip_publico: '',
        login: '',
        password: '',
        http_port: '',
        rtsp_port: '',
        client_id: '',
    })

    function openForm() {
        showForm.value = true
    }

    function closeForm() {
        showForm.value = false

        equipData.value = {
            description: '',
            serial_num: '',
            link_rtsp: '',
            mac: '',
            ip_local: '',
            ip_publico: '',
            login: '',
            password: '',
            http_port: '',
            rtsp_port: '',
            client_id: '',
        }
    }
    
    async function saveEquip() {
        errorMessage.value = ''
        isSaving.value = true

        try {
            const isSaving = ref(false)
            isSaving.value = true

            const formattedData = {
                description: equipData.value.description || null,
                serial_num: equipData.value.serial_num || null,
                mac: equipData.value.mac || null,
                ip_local: equipData.value.ip_local || null,
                ip_publico: equipData.value.ip_publico || null,
                login: equipData.value.login || null,
                password: equipData.value.password || null,
                http_port: equipData.value.http_port ? Number(equipData.value.http_port) : null,
                rtsp_port: equipData.value.rtsp_port ? Number(equipData.value.rtsp_port) : null,
                client_id: equipData.value.client_id ? Number(equipData.value.client_id) : null
            }

            console.log('Sending data:', formattedData);

            const response = await fetch('http://localhost:3000/equips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ formattedData })
            })

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }

            const result = await response.json()
            console.log('Created equipment: ', result);

            closeForm()
        } catch (error) {
            console.error(('Error: ', error))
            alert('Error: ' + error.message)
        }
    }
</script>

<template>
    <button @click="openForm">
        + Add equipments
    </button>
    <div v-if="showForm" class="modal-overlay" @click="closeForm">
        <div class="modal-content" @click.stop>
            <form @submit.prevent="saveEquip">
                <div class="form-group">
                    <label>Description:</label>
                    <input
                    type="text"
                    v-model="equipData.description"
                    placeholder="Texto aqui..."
                    required
                    >
                </div>
                <div class="form-group">
                    <label>Serial number:</label>
                    <input
                    type="text"
                    v-model="equipData.serial_num"
                    placeholder="Texto aqui..."
                    required
                    >
                </div>
                <div class="form-group">
                    <label>Mac Address:</label>
                    <input
                    type="text"
                    v-model="equipData.mac"
                    placeholder="Texto aqui..."
                    required
                    >
                </div>
                <div class="form-group">
                    <label>Local IP:</label>
                    <input
                    type="text"
                    v-model="equipData.ip_local"
                    placeholder="Texto aqui..."
                    required
                    >
                </div>
                <div class="form-group">
                    <label>Public IP:</label>
                    <input
                    type="text"
                    v-model="equipData.ip_publico"
                    placeholder="Texto aqui..."
                    required
                    >
                </div>
                <div class="form-group">
                    <label>Login:</label>
                    <input
                    type="text"
                    v-model="equipData.login"
                    placeholder="Texto aqui..."
                    required
                    >
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input
                    type="text"
                    v-model="equipData.password"
                    placeholder="Texto aqui..."
                    required
                    >
                </div>
                <div class="form-group">
                    <label>HTTP Port:</label>
                    <input
                    type="number"
                    v-model="equipData.http_port"
                    placeholder="Texto aqui..."
                    required
                    >
                </div>
                <div class="form-group">
                    <label>RTSP Port:</label>
                    <input
                    type="number"
                    v-model="equipData.rtsp_port"
                    placeholder="Texto aqui..."
                    required
                    >
                </div>
                <div class="form-group">
                    <label>Client:</label>
                    <input
                    type="number"
                    v-model="equipData.client_id"
                    placeholder="Texto aqui..."
                    required
                    >
                </div>
                <div>
                    <button type="button" @click="closeForm">
                        Cancel
                    </button>
                    <button type="submit">
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>