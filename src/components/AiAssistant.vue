<template>
  <div class="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40">
    <!-- Floating Circular Button (Desktop only, mobile has it in bottom nav) -->
    <button
      v-if="!store.isAiAssistantOpen"
      @click="store.isAiAssistantOpen = true"
      class="hidden md:flex group relative items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-brand-700 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/80"
      aria-label="ფარმაგიდის AI კონსულტანტი"
    >
      <Bot class="w-6 h-6 group-hover:rotate-6 transition-transform" />
      <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white"></span>

      <!-- Tooltip -->
      <span class="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ფარმაგიდის AI კონსულტანტი
      </span>
    </button>

    <!-- Chat Modal Window -->
    <div
      v-else
      class="w-[94vw] sm:w-96 h-[520px] max-h-[75vh] md:max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-brand-700 to-emerald-700 p-4 text-white flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
            <Sparkles class="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 class="text-xs font-bold leading-tight">ფარმაგიდის AI კონსულტანტი</h3>
            <div class="flex items-center gap-1.5 text-[11px] text-emerald-100/90 mt-0.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ონლაინ რეჟიმში • 24/7</span>
            </div>
          </div>
        </div>

        <button
          @click="store.isAiAssistantOpen = false"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Quick Suggestion Chips (Shown initially or above input) -->
      <div class="bg-slate-50/80 px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
        <button
          v-for="(chip, idx) in quickChips"
          :key="idx"
          @click="sendQuickMessage(chip)"
          class="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-700 font-medium transition-all cursor-pointer shadow-2xs"
        >
          {{ chip }}
        </button>
      </div>

      <!-- Messages Thread -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40 text-xs">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex flex-col"
          :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
        >
          <div
            class="max-w-[85%] rounded-2xl p-3.5 leading-relaxed"
            :class="msg.sender === 'user'
              ? 'bg-brand-600 text-white rounded-br-xs shadow-xs'
              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs'"
          >
            <p class="whitespace-pre-wrap">{{ msg.text }}</p>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 px-1">
            {{ msg.time }}
          </span>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200/80 w-fit text-slate-400 shadow-2xs">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>

      <!-- Chat Input Footer -->
      <div class="p-3 bg-white border-t border-slate-100 space-y-2">
        <form @submit.prevent="handleSend" class="flex items-center gap-2">
          <input
            v-model="inputQuery"
            type="text"
            placeholder="დასვით შეკითხვა მედიკამენტზე..."
            class="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-brand-600 focus:bg-white text-slate-900 transition-colors"
          />
          <button
            type="submit"
            :disabled="!inputQuery.trim() || isTyping"
            class="w-9 h-9 rounded-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
          >
            <Send class="w-4 h-4" />
          </button>
        </form>

        <p class="text-[10px] text-slate-400 text-center">
          AI კონსულტანტი არ ცვლის ექიმის ოფიციალურ რეცეპტს.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { usePharmacyStore } from '../stores/pharmacyStore'
import {
  Bot,
  Sparkles,
  X,
  Send,
} from 'lucide-vue-next'

const store = usePharmacyStore()

interface ChatMessage {
  sender: 'ai' | 'user'
  text: string
  time: string
}

const inputQuery = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLDivElement | null>(null)

const quickChips = [
  'როგორ მივიღო რეცეპტორული პრეპარატი?',
  'რამდენ ხანში მომიტანს კურიერი?',
  'რომელი ფილიალია 24/7 ღია?',
  'მირჩიეთ ვიტამინები იმუნიტეტისთვის',
]

const messages = ref<ChatMessage[]>([
  {
    sender: 'ai',
    text: 'მოგესალმებით! მე ვარ ფარმაგიდის AI ასისტენტი. რით შემიძლია დაგეხმაროთ დღეს? შემიძლია მოგაწოდოთ ინფორმაცია მედიკამენტების, ექსპრეს მიწოდების ან ფილიალების შესახებ.',
    time: 'ახლახან',
  },
])

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function sendQuickMessage(text: string) {
  inputQuery.value = text
  handleSend()
}

function handleSend() {
  const query = inputQuery.value.trim()
  if (!query) return

  const now = new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' })

  // Push user message
  messages.value.push({
    sender: 'user',
    text: query,
    time: now,
  })
  inputQuery.value = ''
  scrollToBottom()

  isTyping.value = true

  // Simulate smart contextual answer
  setTimeout(() => {
    isTyping.value = false
    const answer = generateAnswer(query)
    messages.value.push({
      sender: 'ai',
      text: answer,
      time: new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' }),
    })
    scrollToBottom()
  }, 1000)
}

function generateAnswer(query: string): string {
  const q = query.toLowerCase()

  if (q.includes('რეცეპტ') || q.includes('ii ჯგუფ')) {
    return 'საქართველოს მოქმედი კანონმდებლობით, II ჯგუფის რეცეპტორული მედიკამენტების (მაგ. ანტიბიოტიკების) კურიერული მიწოდება აკრძალულია. თქვენ შეგიძლიათ საიტიდან უფასოდ დაჯავშნოთ სასურველ ფილიალში (მაგ. ვაჟა-ფშაველა ან ლუბლიანა) და გაიტანოთ ექიმის რეცეპტის საფუძველზე.'
  }

  if (q.includes('მიწოდებ') || q.includes('კურიერ') || q.includes('wolt') || q.includes('დრო')) {
    return 'Wolt Drive ექსპრეს მიწოდება თბილისში ხორციელდება შეკვეთიდან საშუალოდ 40 წუთში (ღირებულება 4.50 ₾). რეგიონებში მიწოდება ხდება საქართველოს ფოსტის მეშვეობით 2-3 სამუშაო დღეში (ღირებულება 7.00 ₾).'
  }

  if (q.includes('ფილიალ') || q.includes('24/7') || q.includes('საათ')) {
    return 'ფარმაგიდის ლუბლიანას ფილიალი (დიღმის კლინიკურ კვარტალში, ლუბლიანას ქ. №2/6) მუშაობს უწყვეტ 24/7 რეჟიმში. ვაჟა-ფშაველას ფილიალი ღიაა 08:00-დან 23:00-მდე, ხოლო წერეთლის ფილიალი — 08:30-დან 22:30-მდე.'
  }

  if (q.includes('ვიტამინ') || q.includes('იმუნიტეტ')) {
    return 'იმუნიტეტის გასაძლიერებლად გირჩევთ შუშხუნა ვიტამინ C 1000მგ-ს თუთიასთან ერთად, ვიტამინ D3 2000 სე-ს და Solgar-ის სამმაგ ომეგა 3-ს. ყველა მათგანი ხელმისაწვდომია ექსპრეს მიწოდებით კატეგორიაში "ვიტამინები და იმუნიტეტი".'
  }

  if (q.includes('კოსმეტიკ') || q.includes('კან')) {
    return 'დერმოკოსმეტიკის კატალოგში გვაქვს La Roche-Posay Cicaplast B5+ აღმდგენი ბალზამი, CeraVe კერამიდებიანი დამატენიანებელი კრემი და Vichy Mineral 89 ბუსტერი 20%-მდე ფასდაკლებით.'
  }

  return 'გმადლობთ შეკითხვისთვის! ჩვენი სააფთიაქო ქსელი გთავაზობთ 100% სერტიფიცირებულ ევროპულ და ქართულ პრეპარატებს. საჭიროების შემთხვევაში შეგიძლიათ დაუკავშირდეთ ჩვენს ცხელ ხაზს: 032 2 40 40 40.'
}
</script>
