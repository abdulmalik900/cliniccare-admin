<script setup>
import { computed, ref } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import { useUiStore } from '@/stores/ui'
import Modal from '@/components/Modal.vue'

const clinic = useClinicStore()
const ui = useUiStore()

const messages = computed(() => clinic.messages)

const showComposeModal = ref(false)
const newMessage = ref({
  from: 'Admin (You)',
  role: 'Administrator',
  subject: '',
  preview: ''
})

const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const markRead = (id) => {
  clinic.markMessageRead(id)
}

const handleCompose = () => {
  clinic.addMessage({
    ...newMessage.value,
    read: true, // Sent messages are "read"
    time: new Date().toISOString()
  })
  ui.addToast('Message sent successfully', 'success')
  showComposeModal.value = false
  newMessage.value = { from: 'Admin (You)', role: 'Administrator', subject: '', preview: '' }
}
</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Messages</h1>
        <p class="cc-page-subtitle">Internal communications and patient queries</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow" @click="showComposeModal = true">
          <i class="ri-edit-box-line"></i> Compose
        </button>
      </div>
    </div>

    <div class="messages-container cc-card" v-if="messages.length > 0">
      <div class="msg-list">
        <div 
          class="msg-item" 
          v-for="msg in messages" 
          :key="msg.id"
          :class="{ unread: !msg.read }"
          @click="markRead(msg.id)"
        >
          <div class="msg-avatar cc-gradient-primary">
            {{ msg.from.charAt(0) }}
          </div>
          <div class="msg-content">
            <div class="msg-top">
              <span class="msg-sender font-bold">{{ msg.from }}</span>
              <span class="msg-time">{{ formatDate(msg.time) }}</span>
            </div>
            <div class="msg-subject">{{ msg.subject }}</div>
            <div class="msg-preview">{{ msg.preview }}</div>
          </div>
          <div class="msg-indicator" v-if="!msg.read"></div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state cc-card">
      <i class="ri-message-3-line"></i>
      <p>Your inbox is empty.</p>
    </div>

    <!-- Compose Modal -->
    <Modal :show="showComposeModal" title="Compose Message" @close="showComposeModal = false" width="500px">
      <form id="composeForm" @submit.prevent="handleCompose" class="form-grid">
        <div class="form-group full-width">
          <label>Subject</label>
          <input type="text" v-model="newMessage.subject" required placeholder="Enter message subject" />
        </div>
        <div class="form-group full-width">
          <label>Message Content</label>
          <textarea v-model="newMessage.preview" rows="4" required placeholder="Type your message here..."></textarea>
        </div>
      </form>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showComposeModal = false">Cancel</button>
        <button type="submit" form="composeForm" class="cc-btn cc-btn-primary">Send Message</button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
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
  font-weight: 700;
  color: var(--cc-text);
}
.form-group input, .form-group textarea {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--cc-border);
  background: var(--cc-surface);
  color: var(--cc-text);
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.messages-container {
  padding: 0;
  overflow: hidden;
}

.msg-item {
  display: flex;
  padding: 20px 24px;
  gap: 16px;
  border-bottom: 1px solid var(--cc-border);
  cursor: pointer;
  transition: background var(--cc-trans);
  position: relative;
}
.msg-item:last-child {
  border-bottom: none;
}
.msg-item:hover {
  background: var(--cc-surface-2);
}
.msg-item.unread {
  background: rgba(98, 43, 20, 0.03);
}

.msg-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.msg-content {
  flex: 1;
  min-width: 0;
}

.msg-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.msg-sender {
  color: var(--cc-text);
}
.font-bold { font-weight: 700; }

.msg-time {
  font-size: 12px;
  color: var(--cc-text-muted);
}

.msg-subject {
  font-size: 14px;
  font-weight: 600;
  color: var(--cc-text);
  margin-bottom: 4px;
}
.unread .msg-subject {
  color: var(--cc-primary);
  font-weight: 800;
}

.msg-preview {
  font-size: 14px;
  color: var(--cc-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--cc-primary);
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
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
