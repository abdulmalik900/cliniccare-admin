<script setup>
import { useUiStore } from '@/stores/ui'
const ui = useUiStore()
</script>

<template>
  <router-view />

  <!-- Toast stack -->
  <div class="cc-toast-stack">
    <transition-group name="cc-toast">
      <div
        v-for="t in ui.toasts"
        :key="t.id"
        class="cc-toast"
        :class="`cc-toast-${t.type}`"
      >
        <i
          :class="
            t.type === 'success'
              ? 'ri-checkbox-circle-fill'
              : t.type === 'error'
                ? 'ri-error-warning-fill'
                : 'ri-information-fill'
          "
        />
        <span>{{ t.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<style>
.cc-toast-stack {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
}
.cc-toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: var(--cc-surface);
  border-left: 4px solid var(--cc-success);
  border-radius: 10px;
  box-shadow: var(--cc-shadow-lg);
  font-size: 14px;
  font-weight: 500;
  min-width: 260px;
  color: var(--cc-text);
}
.cc-toast i {
  font-size: 20px;
  color: var(--cc-success);
}
.cc-toast-error { border-left-color: var(--cc-danger); }
.cc-toast-error i { color: var(--cc-danger); }
.cc-toast-info { border-left-color: var(--cc-info); }
.cc-toast-info i { color: var(--cc-info); }

.cc-toast-enter-from,
.cc-toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.cc-toast-enter-active,
.cc-toast-leave-active {
  transition: all 0.3s ease;
}
</style>
