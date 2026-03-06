<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router';

</script>
<script>
export default {
    props: {
        to: { type: String, required: true },
        icon: { type: String, required: true }
    },
    setup(props) {
        const route = useRoute()
        const isActive = computed(() => route.path === props.to)
        return { isActive }
    }
}
</script>
<template>
    <div>
        <router-link
        :to="to"
        class="link
        rounded-xl"
        :class="{ active: isActive }">
            <i
            :class="icon"
            class="icon" />
        </router-link>
    </div>
</template>

<style>
.icon {
    font-size: 20pt;
    background: none;
    padding: 20px 10px;
    margin-left: 8px;
}

.link {
    display: flex;
    align-items: center;

    background-color: var(--sidebar-bg-color);

    margin-top: 20px;
    margin-bottom: 20px;
}

.link:hover {
    background-color: var(--sidebar-item-hover);
}

.router-link-active.router-link-exact-active.link {
    background-color: var(--sidebar-item-active) !important;
}
</style>