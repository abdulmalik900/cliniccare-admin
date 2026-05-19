<script setup>
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

const activeTab = ref('profile')

const profile = ref({
  name: 'Admin User',
  email: 'admin@cliniccare.demo',
  phone: '+1 800 555 1234',
  role: 'Super Admin'
})

const clinicInfo = ref({
  name: 'ClinicCare General',
  address: '123 Health Avenue, Medical District',
  phone: '+1 800 123 4567',
  email: 'contact@cliniccare.demo',
  website: 'www.cliniccare.demo'
})

const saveSettings = () => {
  ui.addToast('Settings saved successfully', 'success')
}
</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Settings</h1>
        <p class="cc-page-subtitle">Configure system preferences and clinic profile</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow" @click="saveSettings">
          <i class="ri-save-3-line"></i> Save Changes
        </button>
      </div>
    </div>

    <div class="settings-layout">
      <!-- Settings Sidebar -->
      <div class="cc-card settings-nav">
        <button 
          class="s-nav-btn" 
          :class="{ active: activeTab === 'profile' }"
          @click="activeTab = 'profile'"
        >
          <i class="ri-user-settings-line"></i> My Profile
        </button>
        <button 
          class="s-nav-btn" 
          :class="{ active: activeTab === 'clinic' }"
          @click="activeTab = 'clinic'"
        >
          <i class="ri-hospital-line"></i> Clinic Info
        </button>
        <button 
          class="s-nav-btn" 
          :class="{ active: activeTab === 'security' }"
          @click="activeTab = 'security'"
        >
          <i class="ri-lock-password-line"></i> Security
        </button>
        <button 
          class="s-nav-btn" 
          :class="{ active: activeTab === 'notifications' }"
          @click="activeTab = 'notifications'"
        >
          <i class="ri-notification-badge-line"></i> Notifications
        </button>
      </div>

      <!-- Settings Content -->
      <div class="settings-content">
        
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="cc-card form-card cc-fade-in">
          <h2 class="form-title">Profile Settings</h2>
          
          <div class="avatar-upload">
            <img src="https://i.pravatar.cc/150?img=68" alt="Admin" class="avatar-lg" />
            <div class="upload-actions">
              <button class="cc-btn cc-btn-secondary cc-btn-sm">Change Photo</button>
              <button class="cc-btn cc-btn-ghost cc-btn-sm text-danger">Remove</button>
            </div>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="profile.name" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" v-model="profile.email" />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" v-model="profile.phone" />
            </div>
            <div class="form-group">
              <label>Role</label>
              <input type="text" v-model="profile.role" disabled />
            </div>
          </div>
        </div>

        <!-- Clinic Tab -->
        <div v-if="activeTab === 'clinic'" class="cc-card form-card cc-fade-in">
          <h2 class="form-title">Clinic Information</h2>
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Clinic Name</label>
              <input type="text" v-model="clinicInfo.name" />
            </div>
            <div class="form-group full-width">
              <label>Address</label>
              <input type="text" v-model="clinicInfo.address" />
            </div>
            <div class="form-group">
              <label>Contact Phone</label>
              <input type="tel" v-model="clinicInfo.phone" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" v-model="clinicInfo.email" />
            </div>
            <div class="form-group full-width">
              <label>Website URL</label>
              <input type="url" v-model="clinicInfo.website" />
            </div>
          </div>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="cc-card form-card cc-fade-in">
          <h2 class="form-title">Security Settings</h2>
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div class="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
          </div>
          <button class="cc-btn cc-btn-primary mt-20">Update Password</button>
        </div>

        <!-- Notifications Tab -->
        <div v-if="activeTab === 'notifications'" class="cc-card form-card cc-fade-in">
          <h2 class="form-title">Notification Preferences</h2>
          <div class="toggle-list">
            <div class="toggle-item">
              <div>
                <div class="font-bold">Email Notifications</div>
                <div class="text-muted">Receive daily summaries via email</div>
              </div>
              <input type="checkbox" checked class="cc-toggle" />
            </div>
            <div class="toggle-item">
              <div>
                <div class="font-bold">SMS Alerts</div>
                <div class="text-muted">Get SMS for critical alerts and cancellations</div>
              </div>
              <input type="checkbox" checked class="cc-toggle" />
            </div>
            <div class="toggle-item">
              <div>
                <div class="font-bold">Desktop Notifications</div>
                <div class="text-muted">Show desktop toasts while active</div>
              </div>
              <input type="checkbox" checked class="cc-toggle" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.settings-nav {
  width: 260px;
  display: flex;
  flex-direction: column;
  padding: 12px;
  flex-shrink: 0;
}

.s-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--cc-radius-sm);
  color: var(--cc-text-muted);
  font-weight: 600;
  transition: all var(--cc-trans);
  text-align: left;
}
.s-nav-btn i {
  font-size: 20px;
}
.s-nav-btn:hover {
  background: var(--cc-surface-2);
  color: var(--cc-primary);
}
.s-nav-btn.active {
  background: linear-gradient(90deg, var(--cc-cream-soft), transparent);
  color: var(--cc-primary);
  border-left: 4px solid var(--cc-primary);
}
.s-nav-btn.active i {
  color: var(--cc-primary);
}

.settings-content {
  flex: 1;
}

.form-card {
  padding: 32px;
}

.form-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--cc-text);
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--cc-border);
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}
.avatar-lg {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--cc-cream);
}
.upload-actions {
  display: flex;
  gap: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--cc-text-muted);
}
.form-group input:disabled {
  background: var(--cc-surface-2);
  cursor: not-allowed;
  opacity: 0.7;
}

.mt-20 {
  margin-top: 20px;
}

.text-danger {
  color: var(--cc-danger);
}
.text-danger:hover {
  background: rgba(185, 74, 58, 0.1);
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.font-bold {
  font-weight: 700;
  color: var(--cc-text);
  margin-bottom: 4px;
}
.text-muted {
  font-size: 13px;
  color: var(--cc-text-muted);
}

/* Simple Mock Toggle styling */
.cc-toggle {
  appearance: none;
  width: 48px;
  height: 24px;
  background: var(--cc-border);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background var(--cc-trans);
}
.cc-toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform var(--cc-trans);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.cc-toggle:checked {
  background: var(--cc-primary);
}
.cc-toggle:checked::after {
  transform: translateX(24px);
}

@media (max-width: 768px) {
  .settings-layout {
    flex-direction: column;
  }
  .settings-nav {
    width: 100%;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
