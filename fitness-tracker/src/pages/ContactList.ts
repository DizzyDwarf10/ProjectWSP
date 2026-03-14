import { defineStore } from "pinia"
import { ref } from "vue"
import type { ContactMessage } from "../types"

export const useContactStore = defineStore("contact", () => {
  const messages = ref<ContactMessage[]>([])

  const submitMessage = (name: string, email: string, message: string) => {
    messages.value.push({
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toISOString()
    })
  }

  return { messages, submitMessage }
})