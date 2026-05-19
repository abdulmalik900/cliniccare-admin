<script setup>
defineProps({
  show: Boolean,
  title: String,
  width: {
    type: String,
    default: '500px'
  }
})

defineEmits(['close'])
</script>

<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-dialog" :style="{ width: width }">
          <div class="modal-content cc-card cc-glass">
            <div class="modal-header">
              <h3>{{ title }}</h3>
              <button class="close-btn" @click="$emit('close')">
                <i class="ri-close-line"></i>
              </button>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
            <div class="modal-footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(42, 29, 18, 0.4);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-dialog {
  max-width: 100%;
  animation: modal-slide-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(98, 43, 20, 0.2);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--cc-glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  font-size: 18px;
  font-weight: 800;
  color: var(--cc-primary);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--cc-text-muted);
  transition: all var(--cc-trans);
}
.close-btn:hover {
  background: var(--cc-surface-2);
  color: var(--cc-danger);
}

.modal-body {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--cc-glass-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: rgba(255, 255, 255, 0.5);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-slide-in {
  from {
    transform: translateY(-40px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .modal-backdrop {
    padding: 12px;
  }
  .modal-dialog {
    width: 100% !important;
    margin: 0;
  }
  .modal-body {
    padding: 20px 16px;
  }
  .modal-footer {
    padding: 12px 16px;
  }
}
</style>
