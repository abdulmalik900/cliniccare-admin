<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useClinicStore } from '@/stores/clinic'

const route = useRoute()
const auth = useAuthStore()
const clinic = useClinicStore()

const isMobile = () => window.innerWidth <= 768
const sidebarOpen = ref(!isMobile())

// Close sidebar on mobile when route changes
watch(() => route.path, () => {
  if (isMobile()) sidebarOpen.value = false
})

const handleResize = () => {
  if (!isMobile()) sidebarOpen.value = true
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const handleLogout = () => {
  auth.logout()
}

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'ri-dashboard-2-line' },
  { name: 'Patients', path: '/patients', icon: 'ri-user-heart-line' },
  { name: 'Doctors', path: '/doctors', icon: 'ri-stethoscope-line' },
  { name: 'Appointments', path: '/appointments', icon: 'ri-calendar-check-line' },
  { name: 'Billing', path: '/billing', icon: 'ri-bill-line' },
  { name: 'Prescriptions', path: '/prescriptions', icon: 'ri-capsule-line' },
  { name: 'Departments', path: '/departments', icon: 'ri-hospital-line' },
  { name: 'Inventory', path: '/inventory', icon: 'ri-archive-stack-line' },
  { name: 'Staff', path: '/staff', icon: 'ri-team-line' },
  { name: 'Messages', path: '/messages', icon: 'ri-message-3-line' },
  { name: 'Reports', path: '/reports', icon: 'ri-line-chart-line' },
  { name: 'Settings', path: '/settings', icon: 'ri-settings-3-line' },
]
</script>

<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': !sidebarOpen }">
      <div class="sidebar-header">
        <div class="logo cc-gradient-primary">
          <i class="ri-heart-pulse-fill"></i>
        </div>
        <h2 class="brand-name" v-if="sidebarOpen">ClinicCare</h2>
        <button class="mobile-close cc-btn-icon" @click="sidebarOpen = false">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="nav-item-active"
          :title="!sidebarOpen ? item.name : ''"
        >
          <i :class="item.icon"></i>
          <span v-show="sidebarOpen">{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout-btn" @click="handleLogout">
          <i class="ri-logout-box-r-line"></i>
          <span v-if="sidebarOpen">Log Out</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    <transition name="fade">
      <div 
        v-if="sidebarOpen" 
        class="mobile-overlay" 
        @click="sidebarOpen = false"
      ></div>
    </transition>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Topbar -->
      <header class="topbar cc-glass">
        <div class="topbar-left">
          <button class="cc-btn-icon" @click="sidebarOpen = !sidebarOpen">
            <i class="ri-menu-2-line"></i>
          </button>
          <div class="search-bar">
            <i class="ri-search-line"></i>
            <input type="text" placeholder="Search patients, doctors..." />
          </div>
        </div>

        <div class="topbar-right">
          <button class="cc-btn-icon notification-btn">
            <i class="ri-notification-3-line"></i>
            <span class="notification-dot"></span>
          </button>
          <div class="user-profile cc-glass">
            <img src="https://i.pravatar.cc/150?img=68" alt="Admin" class="avatar" />
            <div class="user-info">
              <span class="user-name">Malik</span>
              <span class="user-role">Super Admin</span>
            </div>
            <i class="ri-arrow-down-s-line profile-arrow"></i>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="page-container">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--cc-bg);
}

.sidebar {
  width: 260px;
  background: var(--cc-surface);
  border-right: 1px solid var(--cc-border);
  display: flex;
  flex-direction: column;
  transition: width var(--cc-trans);
  z-index: 100;
  box-shadow: var(--cc-shadow-sm);
}
.sidebar-collapsed {
  width: 72px;
}
.sidebar-collapsed .sidebar-header {
  padding: 24px 0;
  justify-content: center;
}
.sidebar-collapsed .sidebar-nav {
  padding: 20px 12px;
}
.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 12px 0;
  gap: 0;
}
.sidebar-collapsed .sidebar-footer {
  padding: 20px 12px;
}

.sidebar-header {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--cc-border);
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: var(--cc-shadow-sm);
}

.brand-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--cc-primary);
  white-space: nowrap;
  letter-spacing: -0.5px;
}

.mobile-close {
  display: none;
  margin-left: auto;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: var(--cc-radius-sm);
  color: var(--cc-text-muted);
  font-weight: 600;
  font-size: 15px;
  transition: all var(--cc-trans);
  text-decoration: none;
  white-space: nowrap;
}

.nav-item i {
  font-size: 20px;
}

.nav-item:hover {
  background: var(--cc-surface-2);
  color: var(--cc-primary);
}

.nav-item-active {
  background: linear-gradient(90deg, var(--cc-cream-soft), transparent);
  color: var(--cc-primary);
  border-left: 4px solid var(--cc-primary);
}
.nav-item-active i {
  color: var(--cc-primary);
}

.sidebar-footer {
  padding: 20px 12px;
  border-top: 1px solid var(--cc-border);
}
.logout-btn {
  width: 100%;
  color: var(--cc-danger);
}
.logout-btn:hover {
  background: rgba(185, 74, 58, 0.1);
  color: var(--cc-danger);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.topbar {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: 10;
}

.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  position: relative;
  width: 300px;
}
.search-bar i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--cc-text-muted);
}
.search-bar input {
  padding-left: 40px;
  border-radius: 20px;
  background: var(--cc-surface-2);
  border: none;
}
.search-bar input:focus {
  background: var(--cc-surface);
  border: 1px solid var(--cc-secondary);
}

.notification-btn {
  position: relative;
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: var(--cc-danger);
  border-radius: 50%;
  border: 2px solid var(--cc-surface);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px;
  padding-right: 8px;
  border-radius: 24px;
  transition: all var(--cc-trans);
}
.user-profile:hover {
  background: var(--cc-surface-2);
  transform: translateY(-1px);
}

.profile-arrow {
  font-size: 18px;
  color: var(--cc-text-muted);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--cc-cream);
}

.user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--cc-text);
}
.user-role {
  font-size: 12px;
  color: var(--cc-text-muted);
}

.page-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 40px;
}

.mobile-overlay {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(42, 29, 18, 0.4);
  backdrop-filter: blur(4px);
  z-index: 90;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.page-fade-enter-active, .page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .mobile-overlay {
    display: block;
  }
  .sidebar {
    position: absolute;
    height: 100vh;
    left: 0;
    top: 0;
    transform: translateX(0);
    width: 260px;
  }
  .sidebar-collapsed {
    transform: translateX(-100%);
  }
  .mobile-close {
    display: flex;
  }
  .nav-item span {
    display: inline-block !important;
  }
  .search-bar {
    display: none;
  }
  .user-info {
    display: none;
  }
  .topbar {
    padding: 0 16px;
  }
}
</style>
