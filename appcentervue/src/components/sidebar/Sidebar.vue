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
    <div class="sidebar
    elevation-4
    rounded-lg">
        <div
        class="header-content"
        >
        <h1>
            H
        </h1>
        </div>

        <SidebarLink to="/" icon="fa-regular fa-house"</SidebarLink>
        <SidebarLink to="/equipments" icon="fa-solid fa-screwdriver-wrench"></SidebarLink>
        
    </div>
</template>
<style>
:root {
    --sidebar-bg-color: #f9f5ec;
    --sidebar-item-hover: #9a9a9a;
    --sidebar-item-active: #333333;
}
</style>

<style scoped>

.header-content {
    display: inline;
}

.sidebar {
    color: black;
    background-color: var(--sidebar-bg-color);

    float: left;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    width: 60px;

    transition: 0.3s ease;

    display: flex;
    flex-direction: column;
}

.side-header {
    margin-left: 10px;
}

.collapse-icon {
    position: absolute;
    top: 0;
    margin-left: 166px;
    margin-top: 28px;
    font-size: 18px;

    color: rgba(0, 0, 0, 0.7);
    background: none;
    background-color: rgb(0, 13, 50);

    transition: transform 0.3s ease;
}

.collapse-icon:hover {
    cursor: pointer;
}

.icon-collapsed {
    margin-left: 30px;
}

.rotate-180 {
    transform: rotate(180deg);
    transition: 0.2s linear;
}
</style>