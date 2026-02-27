<script>
import SidebarLink from './SidebarLink.vue';

export default {
    props: {},
    components: { SidebarLink },
    setup() {

    }
}


</script>

<template>
    <div
    class="sidebar
    elevation-2
    rounded-lg"
    >
        <div class="side-header">
        </div>

        <div class="link-items">
            <SidebarLink to="/" icon="fa-regular fa-house" />
            <SidebarLink to="/equipments" icon="fa-solid fa-screwdriver-wrench"/>
        </div>
    </div> 
   
</template>

<style>
:root {
    --sidebar-bg-color: #f9f5ec;
    --sidebar-item-hover: #d4cdbe;
    --sidebar-item-active: #d4cdbe;
}
</style>

<style scoped>
.sidebar {
    background-color: var(--sidebar-bg-color);

    float: left;
    width: 70px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;

    transition: 0.3 ease;

    display: flex;
    flex-direction: column;
}

.side-header {
    height: 10%;
}
</style>