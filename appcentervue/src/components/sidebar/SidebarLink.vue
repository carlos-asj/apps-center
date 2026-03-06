<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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
        return { isActive, collapsed }
    }
}
</script>

<template>
    <div class="side-items">
        <router-link :to="to"
        class="link "
        :class="{ active: isActive }">
            <i
            :class="icon"
            class="icon" />
        </router-link>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.link {
    display: flex;
    align-items: center;

    cursor: pointer;
    position: relative;
    font-weight: 400;
    user-select: none;

    margin: 5px 0;
    padding: 30px 8px 30px 8px;
    height: 1.5em;

    color: #1c2021;
    text-decoration: none;
}

.link:hover {
    background-color: var(--sidebar-item-hover);
}

.link.active {
    background-color: var(--sidebar-item-active);
}

.link .icon {
    flex-shrink: 0;
    width: 25px;
    margin-right: 10px;
}

.icon {
    font-size: 18pt;
}
</style>