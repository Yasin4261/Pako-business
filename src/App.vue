<script setup>
import { RouterView } from 'vue-router'
import { useSessionStore } from '@/stores/session.store.js'
import SessionExpiredModal from '@/components/ui/SessionExpiredModal.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'

const sessionStore = useSessionStore()

const handleSessionLogin = () => {
  sessionStore.handleSessionLogin()
}

const handleToastClose = () => {
  sessionStore.hideToast()
}
</script>

<template>
  <RouterView />
  
  <!-- Global Session Expired Modal -->
  <SessionExpiredModal
    :is-open="sessionStore.isSessionExpired"
    :message="sessionStore.sessionMessage"
    @login="handleSessionLogin"
  />
  
  <!-- Global Toast Notifications -->
  <ToastNotification
    :show="sessionStore.toast.show"
    :type="sessionStore.toast.type"
    :title="sessionStore.toast.title"
    :message="sessionStore.toast.message"
    :duration="sessionStore.toast.duration"
    @close="handleToastClose"
  />
</template>
