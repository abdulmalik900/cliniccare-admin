<script setup>
import { computed } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import { useUiStore } from '@/stores/ui'

const clinic = useClinicStore()
const ui = useUiStore()

const analytics = computed(() => clinic.analytics || {})

const maxDeptPatients = computed(() => {
  if (!analytics.value.departmentDistribution) return 1
  return Math.max(...analytics.value.departmentDistribution.map(d => d.value))
})
</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Reports & Analytics</h1>
        <p class="cc-page-subtitle">Deep dive into clinic performance metrics</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow">
          <i class="ri-download-2-line"></i> Export PDF
        </button>
      </div>
    </div>

    <div class="reports-grid" v-if="analytics.departmentDistribution">
      
      <!-- Summary KPI -->
      <div class="cc-card kpi-card cc-gradient-primary">
        <h3>Total Revenue</h3>
        <div class="kpi-value">${{ (analytics.revenue || 0).toLocaleString() }}</div>
        <p class="kpi-sub">+12.5% from last month</p>
      </div>
      <div class="cc-card kpi-card cc-gradient-secondary">
        <h3>Total Patients</h3>
        <div class="kpi-value">{{ analytics.totalPatients || 0 }}</div>
        <p class="kpi-sub">+4.2% from last month</p>
      </div>

      <!-- Department Distribution -->
      <div class="cc-card chart-card full-width">
        <div class="card-header">
          <h3>Patients by Department</h3>
        </div>
        <div class="chart-body">
          <div class="progress-bar-wrap" v-for="dept in analytics.departmentDistribution" :key="dept.label">
            <div class="progress-info">
              <span>{{ dept.label }}</span>
              <span class="font-bold">{{ dept.value }} Patients</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill cc-gradient-secondary" :style="{ width: `${(dept.value / maxDeptPatients) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="empty-state cc-card">
      <i class="ri-pie-chart-2-line"></i>
      <p>No analytics data available.</p>
    </div>
  </div>
</template>

<style scoped>
.header-actions {
  display: flex;
  gap: 12px;
}

.reports-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.kpi-card {
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.kpi-card h3 {
  font-size: 16px;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -1px;
}

.kpi-sub {
  font-size: 13px;
  opacity: 0.8;
  margin-top: 8px;
}

.full-width {
  grid-column: 1 / -1;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--cc-border);
}
.card-header h3 {
  font-size: 16px;
  font-weight: 700;
}

.chart-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--cc-text-muted);
}
.font-bold {
  font-weight: 700;
  color: var(--cc-text);
}

.progress-track {
  height: 12px;
  background: var(--cc-surface-2);
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--cc-text-muted);
}
.empty-state i {
  font-size: 56px;
  color: var(--cc-border);
  margin-bottom: 16px;
  display: inline-block;
}
</style>
