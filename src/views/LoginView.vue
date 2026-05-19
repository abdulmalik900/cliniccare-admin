<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const handleLogin = () => {
  if (auth.login(username.value, password.value)) {
    ui.addToast('Welcome back to ClinicCare', 'success')
    router.push('/dashboard')
  } else {
    ui.addToast('Invalid credentials. Hint: malik/12345', 'error')
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-container cc-card cc-fade-in">
      
      <!-- Left Side - Image/Branding -->
      <div class="login-banner cc-gradient-primary">
        <div class="banner-content">
          <div class="logo-large">
            <i class="ri-heart-pulse-fill"></i>
          </div>
          <h2>ClinicCare</h2>
          <p>Digitizing clinic and patient management for a seamless healthcare experience.</p>
        </div>
        <div class="banner-overlay"></div>
      </div>

      <!-- Right Side - Form -->
      <div class="login-form-section">
        <div class="login-header">
          <h1 class="brand-title">Sign In</h1>
          <p class="subtitle">Please login to your account to continue.</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Username</label>
            <div class="input-wrapper">
              <i class="ri-user-line icon-left"></i>
              <input type="text" v-model="username" placeholder="Enter username" required />
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper">
              <i class="ri-lock-line icon-left"></i>
              <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Enter password" required />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="cc-btn cc-btn-primary w-full cc-shadow-glow">
            Log In <i class="ri-arrow-right-line"></i>
          </button>
        </form>

      
      </div>

    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--cc-bg) 0%, var(--cc-cream-soft) 100%);
  position: relative;
  overflow: hidden;
}

/* Background decorative blobs */
.login-wrapper::before,
.login-wrapper::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
}
.login-wrapper::before {
  width: 500px;
  height: 500px;
  background: rgba(153, 95, 47, 0.15); /* secondary */
  top: -100px;
  left: -100px;
  animation: blob-float 10s infinite alternate ease-in-out;
}
.login-wrapper::after {
  width: 600px;
  height: 600px;
  background: rgba(151, 143, 102, 0.15); /* accent */
  bottom: -150px;
  right: -100px;
  animation: blob-float 12s infinite alternate-reverse ease-in-out;
}

@keyframes blob-float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 50px) scale(1.1); }
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 900px;
  height: 540px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--cc-glass-border);
  box-shadow: 0 30px 80px rgba(98, 43, 20, 0.2);
  border-radius: 24px;
  overflow: hidden;
}

/* Left Side - Banner */
.login-banner {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;
  overflow: hidden;
}

.login-banner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 60%);
}

.banner-content {
  position: relative;
  z-index: 2;
  color: var(--cc-cream);
}

.logo-large {
  font-size: 64px;
  margin-bottom: 24px;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.banner-content h2 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  color: #fff;
}

.banner-content p {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
}

/* Right Side - Form */
.login-form-section {
  width: 440px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
}

.login-header {
  margin-bottom: 32px;
}

.brand-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--cc-text);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 14px;
  color: var(--cc-text-muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: var(--cc-text);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.icon-left {
  position: absolute;
  left: 14px;
  color: var(--cc-text-muted);
  font-size: 18px;
}
.input-wrapper input {
  padding-left: 44px;
  padding-top: 14px;
  padding-bottom: 14px;
  border-radius: 12px;
  font-size: 15px;
}

.password-toggle {
  position: absolute;
  right: 14px;
  color: var(--cc-text-muted);
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.password-toggle:hover {
  color: var(--cc-primary);
}

.w-full {
  width: 100%;
  justify-content: center;
  padding-top: 14px;
  padding-bottom: 14px;
  font-size: 16px;
  margin-top: 12px;
  border-radius: 12px;
}

.login-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: var(--cc-text-muted);
  padding-top: 20px;
  border-top: 1px dashed var(--cc-border);
}
.badge-hint {
  background: var(--cc-cream-soft);
  color: var(--cc-primary);
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  border: 1px solid var(--cc-border);
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    height: auto;
    max-width: 420px;
    margin: 20px;
  }
  .login-banner {
    padding: 32px;
    align-items: center;
    text-align: center;
  }
  .login-form-section {
    width: 100%;
    padding: 32px;
  }
}
</style>
