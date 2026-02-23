<!-- Session Expired Modal Component -->
<!-- Single Responsibility: Only handles session expiration notification -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Oturumunuz sona erdi. Güvenliğiniz için tekrar giriş yapmanız gerekmektedir.'
  }
})

const emit = defineEmits(['login', 'close'])

const handleLogin = () => {
  emit('login')
}

const handleBackdropClick = (e) => {
  // Prevent closing by clicking backdrop - user must click login button
  e.stopPropagation()
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            @click.stop
          >
            <!-- Decorative Top Gradient -->
            <div class="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
            
            <!-- Content -->
            <div class="p-6 sm:p-8 text-center">
              <!-- Icon -->
              <div class="mx-auto w-20 h-20 mb-6 relative">
                <!-- Outer ring animation -->
                <div class="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-30"></div>
                <!-- Icon container -->
                <div class="relative w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <svg 
                    class="w-10 h-10 text-amber-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              <!-- Title -->
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Oturum Süresi Doldu
              </h2>

              <!-- Message -->
              <p class="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
                {{ message }}
              </p>

              <!-- Login Button -->
              <button
                @click="handleLogin"
                class="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 to-amber-500 
                       text-white font-semibold rounded-xl
                       hover:from-orange-600 hover:to-amber-600
                       focus:outline-none focus:ring-4 focus:ring-orange-500/30
                       transform transition-all duration-200
                       hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/30
                       active:scale-[0.98]"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Tekrar Giriş Yap
                </span>
              </button>

              <!-- Security Note -->
              <p class="mt-6 text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Güvenliğiniz için otomatik oturum kapatıldı
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
