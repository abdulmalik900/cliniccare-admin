<script setup>
import { computed, ref } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import Modal from '@/components/Modal.vue'

const clinic = useClinicStore()

const selectedAppointment = ref(null)
const showDetailsModal = ref(false)

const openAppointment = (appt) => {
  selectedAppointment.value = appt
  showDetailsModal.value = true
}

// If data isn't loaded yet (though our layout could handle this, let's make it robust)
const analytics = computed(() => clinic.analytics || {})

const stats = computed(() => [
  { label: 'Total Patients', value: (analytics.value.totalPatients || 0).toLocaleString(), icon: 'ri-user-heart-line', color: 'primary' },
  { label: 'Total Doctors', value: (analytics.value.totalDoctors || 0).toLocaleString(), icon: 'ri-stethoscope-line', color: 'info' },
  { label: "Today's Appts", value: (analytics.value.appointmentsToday || 0).toLocaleString(), icon: 'ri-calendar-check-line', color: 'warning' },
  { label: 'Revenue', value: `$${(analytics.value.revenue || 0).toLocaleString()}`, icon: 'ri-money-dollar-circle-line', color: 'success' }
])

const recentAppointments = computed(() => {
  return clinic.appointments.slice(0, 5)
})

const maxMonthlyRevenue = computed(() => {
  if (!analytics.value.monthlyRevenue) return 1
  return Math.max(...analytics.value.monthlyRevenue.map(m => m.value))
})

const maxAppts = computed(() => {
  if (!analytics.value.appointmentsLast7) return 1
  return Math.max(...analytics.value.appointmentsLast7.map(d => d.value))
})
</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Dashboard Overview</h1>
        <p class="cc-page-subtitle">Welcome back, here's what's happening at ClinicCare today.</p>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-grid">
      <div class="cc-card stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :class="`icon-${stat.color}`">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">{{ stat.label }}</p>
          <h3 class="stat-value">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Monthly Revenue Chart (CSS Based) -->
      <div class="cc-card chart-card">
        <div class="card-header">
          <h3>Monthly Revenue</h3>
          <button class="cc-btn-icon"><i class="ri-more-2-fill"></i></button>
        </div>
        <div class="chart-container" v-if="analytics.monthlyRevenue">
          <div class="bar-chart">
            <div class="bar-col" v-for="month in analytics.monthlyRevenue" :key="month.label">
              <div class="bar-wrapper">
                <div class="bar cc-gradient-primary" :style="{ height: `${(month.value / maxMonthlyRevenue) * 100}%` }"></div>
              </div>
              <span class="bar-label">{{ month.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Appointments (CSS Based) -->
      <div class="cc-card chart-card">
        <div class="card-header">
          <h3>Appointments (Last 7 Days)</h3>
          <button class="cc-btn-icon"><i class="ri-more-2-fill"></i></button>
        </div>
        <div class="chart-container" v-if="analytics.appointmentsLast7">
          <div class="bar-chart">
            <div class="bar-col" v-for="day in analytics.appointmentsLast7" :key="day.label">
              <div class="bar-wrapper">
                <div class="bar cc-gradient-secondary" :style="{ height: `${(day.value / maxAppts) * 100}%` }"></div>
              </div>
              <span class="bar-label">{{ day.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Appointments Table -->
      <div class="cc-card table-card full-width">
        <div class="card-header">
          <h3>Recent Appointments</h3>
          <router-link to="/appointments" class="cc-btn cc-btn-ghost cc-btn-sm">View All</router-link>
        </div>
        <div class="table-responsive">
          <table class="cc-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="appt in recentAppointments" :key="appt.id" @click="openAppointment(appt)" class="clickable-row">
                <td class="patient-cell">
                  <div class="avatar-sm cc-gradient-secondary">{{ appt.patientName.charAt(0) }}</div>
                  <span>{{ appt.patientName }}</span>
                </td>
                <td>{{ appt.doctorName }}</td>
                <td>{{ appt.date }} at {{ appt.time }}</td>
                <td>{{ appt.type }}</td>
                <td>
                  <span class="cc-badge" :class="{
                    'cc-badge-success': appt.status === 'Completed',
                    'cc-badge-warning': appt.status === 'Scheduled',
                    'cc-badge-danger': appt.status === 'Cancelled',
                    'cc-badge-info': appt.status === 'In Progress'
                  }">{{ appt.status }}</span>
                </td>
              </tr>
              <tr v-if="recentAppointments.length === 0">
                <td colspan="5" class="empty-state">No recent appointments found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Appointment Details Modal -->
    <Modal :show="showDetailsModal" title="Appointment Details" @close="showDetailsModal = false" width="500px">
      <div v-if="selectedAppointment" class="appt-details">
        <div class="detail-row">
          <label>Patient</label>
          <div class="value">{{ selectedAppointment.patientName }}</div>
        </div>
        <div class="detail-row">
          <label>Doctor</label>
          <div class="value">{{ selectedAppointment.doctorName }}</div>
        </div>
        <div class="detail-row">
          <label>Date & Time</label>
          <div class="value">{{ selectedAppointment.date }} at {{ selectedAppointment.time }}</div>
        </div>
        <div class="detail-row">
          <label>Service Type</label>
          <div class="value">{{ selectedAppointment.type }}</div>
        </div>
        <div class="detail-row">
          <label>Status</label>
          <div class="value">
            <span class="cc-badge" :class="{
              'cc-badge-success': selectedAppointment.status === 'Completed',
              'cc-badge-warning': selectedAppointment.status === 'Scheduled',
              'cc-badge-danger': selectedAppointment.status === 'Cancelled',
              'cc-badge-info': selectedAppointment.status === 'In Progress'
            }">{{ selectedAppointment.status }}</span>
          </div>
        </div>
        <div class="detail-row" v-if="selectedAppointment.notes">
          <label>Notes</label>
          <div class="value notes">{{ selectedAppointment.notes }}</div>
        </div>
      </div>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showDetailsModal = false">Close</button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.clickable-row {
  cursor: pointer;
}

.appt-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--cc-border);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row label {
  font-size: 13px;
  font-weight: 600;
  color: var(--cc-text-muted);
}

.detail-row .value {
  font-weight: 700;
  color: var(--cc-text);
}

.notes {
  font-style: italic;
  font-weight: 400 !important;
  color: var(--cc-text-muted) !important;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--cc-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: var(--cc-shadow-sm);
}

.icon-primary { background: rgba(98, 43, 20, 0.1); color: var(--cc-primary); }
.icon-info { background: rgba(74, 124, 155, 0.1); color: var(--cc-info); }
.icon-warning { background: rgba(212, 155, 44, 0.1); color: var(--cc-warning); }
.icon-success { background: rgba(63, 138, 79, 0.1); color: var(--cc-success); }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: var(--cc-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--cc-text);
  margin-top: 4px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.full-width {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--cc-border);
}
.card-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--cc-text);
}

.chart-card {
  display: flex;
  flex-direction: column;
}

.chart-container {
  padding: 24px;
  height: 260px;
}

.bar-chart {
  display: flex;
  height: 100%;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  gap: 12px;
}

.bar-wrapper {
  flex: 1;
  width: 100%;
  max-width: 40px;
  background: var(--cc-surface-2);
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar {
  width: 100%;
  border-radius: 8px 8px 0 0;
  transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.bar:hover {
  filter: brightness(1.1);
}

.bar-label {
  font-size: 12px;
  color: var(--cc-text-muted);
  font-weight: 600;
}

.table-responsive {
  overflow-x: auto;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.empty-state {
  text-align: center;
  color: var(--cc-text-muted);
  padding: 40px !important;
}

@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
