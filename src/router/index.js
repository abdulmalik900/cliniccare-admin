import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard',     name: 'Dashboard',     component: () => import('@/views/DashboardView.vue'),     meta: { title: 'Dashboard', icon: 'ri-dashboard-2-line' } },
        { path: 'patients',      name: 'Patients',      component: () => import('@/views/PatientsView.vue'),      meta: { title: 'Patients', icon: 'ri-user-heart-line' } },
        { path: 'doctors',       name: 'Doctors',       component: () => import('@/views/DoctorsView.vue'),       meta: { title: 'Doctors', icon: 'ri-stethoscope-line' } },
        { path: 'appointments',  name: 'Appointments',  component: () => import('@/views/AppointmentsView.vue'),  meta: { title: 'Appointments', icon: 'ri-calendar-check-line' } },
        { path: 'billing',       name: 'Billing',       component: () => import('@/views/BillingView.vue'),       meta: { title: 'Billing', icon: 'ri-bill-line' } },
        { path: 'prescriptions', name: 'Prescriptions', component: () => import('@/views/PrescriptionsView.vue'), meta: { title: 'Prescriptions', icon: 'ri-capsule-line' } },
        { path: 'departments',   name: 'Departments',   component: () => import('@/views/DepartmentsView.vue'),   meta: { title: 'Departments', icon: 'ri-hospital-line' } },
        { path: 'inventory',     name: 'Inventory',     component: () => import('@/views/InventoryView.vue'),     meta: { title: 'Inventory', icon: 'ri-archive-stack-line' } },
        { path: 'staff',         name: 'Staff',         component: () => import('@/views/StaffView.vue'),         meta: { title: 'Staff', icon: 'ri-team-line' } },
        { path: 'messages',      name: 'Messages',      component: () => import('@/views/MessagesView.vue'),      meta: { title: 'Messages', icon: 'ri-mail-line' } },
        { path: 'reports',       name: 'Reports',       component: () => import('@/views/ReportsView.vue'),       meta: { title: 'Reports', icon: 'ri-line-chart-line' } },
        { path: 'settings',      name: 'Settings',      component: () => import('@/views/SettingsView.vue'),      meta: { title: 'Settings', icon: 'ri-settings-3-line' } },
      ],
    },
  ],
})

import { useAuthStore } from '@/stores/auth'

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && auth.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
