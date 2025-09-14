import { ref, computed } from 'vue'

const activeRequests = ref(0)
const loadingMessage = ref<string>('')

export const useGlobalLoading = () => {
  const isLoading = computed(() => activeRequests.value > 0)
  
  const startLoading = (message?: string) => {
    activeRequests.value++
    if (message) {
      loadingMessage.value = message
    }
  }
  
  const stopLoading = () => {
    if (activeRequests.value > 0) {
      activeRequests.value--
    }
    if (activeRequests.value === 0) {
      loadingMessage.value = ''
    }
  }
  
  const resetLoading = () => {
    activeRequests.value = 0
    loadingMessage.value = ''
  }
  
  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    resetLoading,
    activeRequests: computed(() => activeRequests.value)
  }
}