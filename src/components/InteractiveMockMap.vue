<template>
  <div class="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs space-y-4 p-5 sm:p-6">
    <!-- Map Header with Mode Label -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
          <Map class="w-4 h-4" />
        </div>
        <div>
          <h4 class="text-xs font-bold text-slate-900">
            ინტერაქტიული რუკა & ლოკაცია
          </h4>
          <p class="text-[11px] text-slate-400">
            {{
              mode === 'wolt_delivery'
                ? 'Wolt Drive ექსპრეს მარშრუტის კალკულაცია'
                : mode === 'click_and_collect'
                  ? 'კლინიკური ფილიალების განლაგება თბილისში'
                  : 'საქართველოს რეგიონული საკურიერო ქსელი'
            }}
          </p>
        </div>
      </div>

      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
        <Radio class="w-3 h-3 text-emerald-500 animate-pulse" />
        <span>GPS Live</span>
      </div>
    </div>

    <!-- SCENARIO A: Address Input for Wolt Drive -->
    <div v-if="mode === 'wolt_delivery'" class="space-y-3">
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">
          მიტანის მისამართი თბილისში:
        </label>
        <div class="relative flex items-center gap-2">
          <div class="relative flex-1">
            <MapPin class="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              :value="address"
              @input="onAddressInput"
              type="text"
              placeholder="შეიყვანეთ მიტანის მისამართი (მაგ: ი. ჭავჭავაძის 37)..."
              class="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-600 text-slate-900 transition-all"
            />
          </div>

          <button
            @click="calculateWoltQuote"
            :disabled="isCalculatingQuote"
            class="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <Loader2 v-if="isCalculatingQuote" class="w-3.5 h-3.5 animate-spin" />
            <Navigation v-else class="w-3.5 h-3.5" />
            <span>{{ isCalculatingQuote ? 'გამოთვლა...' : 'კალკულაცია' }}</span>
          </button>
        </div>
      </div>

      <!-- Quick sample address chips -->
      <div class="flex items-center gap-2 flex-wrap text-[11px]">
        <span class="text-slate-400 font-medium">სწრაფი არჩევა:</span>
        <button
          v-for="sample in sampleAddresses"
          :key="sample"
          @click="selectSampleAddress(sample)"
          class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 font-medium transition-colors cursor-pointer"
        >
          {{ sample }}
        </button>
      </div>

      <!-- Wolt Quote Result Card -->
      <div
        v-if="quoteResult"
        class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between animate-in fade-in duration-200"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Bike class="w-4 h-4" />
          </div>
          <div>
            <div class="text-xs font-bold text-emerald-900">
              მიწოდების საფასური: 4.50 ₾ | სავარაუდო დრო: ~35-40 წთ
            </div>
            <div class="text-[11px] text-emerald-700 mt-0.5">
              Wolt Drive API: კურიერი გამოემართება უახლოესი კლინიკური ჰაბიდან
            </div>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-white text-emerald-800 text-[11px] font-bold border border-emerald-200 shrink-0">
          აქტიურია
        </span>
      </div>
    </div>

    <!-- MAP CONTAINER (SVG Canvas styling with interactive markers) -->
    <div class="relative w-full h-64 sm:h-72 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 shadow-inner select-none">
      <!-- SVG Map Canvas Background: Tbilisi Roads & River -->
      <svg class="w-full h-full object-cover" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0284c7" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#0369a1" stop-opacity="0.35" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Base Background -->
        <rect width="800" height="450" fill="url(#gridGrad)" />

        <!-- Grid Lines -->
        <g stroke="#334155" stroke-width="0.5" stroke-opacity="0.4">
          <line v-for="i in 16" :key="'v'+i" :x1="i * 50" y1="0" :x2="i * 50" y2="450" />
          <line v-for="i in 9" :key="'h'+i" x1="0" :y1="i * 50" x2="800" :y2="i * 50" />
        </g>

        <!-- Mtkvari River (Stylized curve across Tbilisi) -->
        <path
          d="M 120 0 Q 250 180, 420 220 T 700 390 L 750 450 L 710 450 Q 380 240, 210 200 T 80 0 Z"
          fill="url(#riverGrad)"
        />

        <!-- Major Arterial Roads -->
        <!-- Vazha-Pshavela / Kazbegi Avenue -->
        <path d="M 200 450 L 320 280 L 400 240" stroke="#475569" stroke-width="3" stroke-linecap="round" />
        <!-- Rustaveli / Kostava / Chavchavadze -->
        <path d="M 320 280 L 480 290 L 620 350" stroke="#475569" stroke-width="3" stroke-linecap="round" />
        <!-- Digomi / Lubliana Street Highway -->
        <path d="M 160 0 L 220 120 L 320 280" stroke="#475569" stroke-width="3.5" stroke-linecap="round" />
        <!-- Tsereteli Avenue -->
        <path d="M 330 160 L 460 210 L 520 260" stroke="#475569" stroke-width="3" stroke-linecap="round" />

        <!-- SCENARIO A: Wolt Route Line (From Lubliana hub to customer) -->
        <g v-if="mode === 'wolt_delivery'">
          <path
            d="M 240 120 Q 330 200, 480 280"
            stroke="#10b981"
            stroke-width="3"
            stroke-dasharray="6,4"
            fill="none"
          />
        </g>

        <!-- SCENARIO C: Regional Dispatch Route -->
        <g v-if="mode === 'regional_delivery'">
          <path
            d="M 320 280 L 720 180"
            stroke="#3b82f6"
            stroke-width="3"
            stroke-dasharray="6,4"
            fill="none"
          />
        </g>
      </svg>

      <!-- SCENARIO A OVERLAY: Customer & Courier Pins -->
      <div v-if="mode === 'wolt_delivery'">
        <!-- Pickup Clinical Hub Pin (Lubliana) -->
        <div class="absolute left-[30%] top-[26%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
          <div class="px-2 py-0.5 rounded-md bg-emerald-600 text-[10px] font-bold text-white mb-1 shadow-md whitespace-nowrap">
            აფთიაქი (დიღომი)
          </div>
          <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-lg">
            <Store class="w-3.5 h-3.5" />
          </div>
        </div>

        <!-- Wolt Courier In-Transit Marker -->
        <div class="absolute left-[44%] top-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div class="w-7 h-7 rounded-full bg-brand-500 border-2 border-white flex items-center justify-center text-white shadow-lg animate-bounce">
            <Bike class="w-4 h-4" />
          </div>
          <span class="px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-emerald-300 mt-1 whitespace-nowrap">
            ~15 წთ
          </span>
        </div>

        <!-- Customer Destination Pin -->
        <div class="absolute left-[60%] top-[62%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div class="relative">
            <span class="absolute -inset-2 rounded-full bg-emerald-400/40 animate-ping"></span>
            <div class="w-8 h-8 rounded-full bg-white border-2 border-brand-600 flex items-center justify-center text-brand-600 shadow-xl relative z-10">
              <MapPin class="w-4 h-4" />
            </div>
          </div>
          <div class="px-2 py-0.5 rounded-md bg-white text-slate-900 text-[10px] font-bold mt-1 shadow-md whitespace-nowrap">
            თქვენი მისამართი
          </div>
        </div>
      </div>

      <!-- SCENARIO B OVERLAY: 3 Clickable Branch Location Pins in Tbilisi -->
      <div v-if="mode === 'click_and_collect'">
        <!-- Pin 1: Lubliana (Dighomi) -->
        <button
          @click="selectBranch('lubliana')"
          class="absolute left-[30%] top-[26%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 z-20"
        >
          <div
            class="px-2 py-0.5 rounded-md text-[10px] font-bold mb-1 shadow-md whitespace-nowrap transition-colors"
            :class="selectedBranchId === 'lubliana' ? 'bg-brand-600 text-white ring-2 ring-white' : 'bg-slate-800 text-slate-200 group-hover:bg-slate-700'"
          >
            ლუბლიანას ჰაბი
          </div>
          <div
            class="w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg transition-all"
            :class="selectedBranchId === 'lubliana' ? 'bg-brand-600 border-white text-white scale-110' : 'bg-slate-800 border-slate-600 text-slate-300'"
          >
            <Store class="w-3.5 h-3.5" />
          </div>
        </button>

        <!-- Pin 2: Vazha-Pshavela -->
        <button
          @click="selectBranch('vazha')"
          class="absolute left-[40%] top-[62%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 z-20"
        >
          <div
            class="px-2 py-0.5 rounded-md text-[10px] font-bold mb-1 shadow-md whitespace-nowrap transition-colors"
            :class="selectedBranchId === 'vazha' ? 'bg-brand-600 text-white ring-2 ring-white' : 'bg-slate-800 text-slate-200 group-hover:bg-slate-700'"
          >
            ვაჟა-ფშაველა (1.2 კმ)
          </div>
          <div
            class="w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg transition-all"
            :class="selectedBranchId === 'vazha' ? 'bg-brand-600 border-white text-white scale-110' : 'bg-slate-800 border-slate-600 text-slate-300'"
          >
            <Store class="w-3.5 h-3.5" />
          </div>
        </button>

        <!-- Pin 3: Tsereteli -->
        <button
          @click="selectBranch('tsereteli')"
          class="absolute left-[56%] top-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 z-20"
        >
          <div
            class="px-2 py-0.5 rounded-md text-[10px] font-bold mb-1 shadow-md whitespace-nowrap transition-colors"
            :class="selectedBranchId === 'tsereteli' ? 'bg-brand-600 text-white ring-2 ring-white' : 'bg-slate-800 text-slate-200 group-hover:bg-slate-700'"
          >
            წერეთლის გამზ. (5.8 კმ)
          </div>
          <div
            class="w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg transition-all"
            :class="selectedBranchId === 'tsereteli' ? 'bg-brand-600 border-white text-white scale-110' : 'bg-slate-800 border-slate-600 text-slate-300'"
          >
            <Store class="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      <!-- SCENARIO C OVERLAY: Regional dispatch -->
      <div v-if="mode === 'regional_delivery'" class="absolute inset-0 flex items-center justify-center">
        <div class="bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700 text-center text-white">
          <Truck class="w-6 h-6 text-brand-400 mx-auto mb-1" />
          <div class="text-xs font-bold">{{ regionalCity }} — მიწოდება 1-2 დღეში</div>
          <div class="text-[11px] text-slate-400">საქართველოს ფოსტა / რეგიონული საკურიერო სერვისი</div>
        </div>
      </div>
    </div>

    <!-- SCENARIO B: 3 Selectable Branch Cards Below the Map -->
    <div v-if="mode === 'click_and_collect'" class="space-y-2.5 pt-1">
      <div class="text-xs font-bold text-slate-800 mb-1">
        აირჩიეთ თქვენთვის უახლოესი ფილიალი:
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <!-- 1. Vazha-Pshavela -->
        <div
          @click="selectBranch('vazha')"
          class="p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between"
          :class="selectedBranchId === 'vazha' ? 'border-brand-600 bg-brand-50/50 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-900">ვაჟა-ფშაველას გამზ. №6</span>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                1.2 კმ
              </span>
            </div>
            <div class="text-[11px] text-slate-500">
              ღიაა 24/7 • მზადყოფნა: 15 წთ
            </div>
          </div>
          <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-brand-700 font-bold">უფასო გატანა</span>
            <div
              class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
              :class="selectedBranchId === 'vazha' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
            >
              <span v-if="selectedBranchId === 'vazha'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
            </div>
          </div>
        </div>

        <!-- 2. Lubliana Hub -->
        <div
          @click="selectBranch('lubliana')"
          class="p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between"
          :class="selectedBranchId === 'lubliana' ? 'border-brand-600 bg-brand-50/50 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-900">ლუბლიანას ქ. №2/6</span>
              <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                4.1 კმ
              </span>
            </div>
            <div class="text-[11px] text-slate-500">
              კლინიკური ჰაბი • ღიაა 24/7
            </div>
          </div>
          <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-brand-700 font-bold">უფასო გატანა</span>
            <div
              class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
              :class="selectedBranchId === 'lubliana' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
            >
              <span v-if="selectedBranchId === 'lubliana'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
            </div>
          </div>
        </div>

        <!-- 3. Tsereteli -->
        <div
          @click="selectBranch('tsereteli')"
          class="p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between"
          :class="selectedBranchId === 'tsereteli' ? 'border-brand-600 bg-brand-50/50 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-900">ა. წერეთლის გამზ. №113</span>
              <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                5.8 კმ
              </span>
            </div>
            <div class="text-[11px] text-slate-500">
              სამუშაო საათები: 09:00 - 22:00
            </div>
          </div>
          <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-brand-700 font-bold">უფასო გატანა</span>
            <div
              class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
              :class="selectedBranchId === 'tsereteli' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
            >
              <span v-if="selectedBranchId === 'tsereteli'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BranchId, FulfillmentType } from '../types'
import {
  Map,
  MapPin,
  Store,
  Bike,
  Truck,
  Navigation,
  Loader2,
  Radio,
} from 'lucide-vue-next'

const props = defineProps<{
  mode: FulfillmentType
  selectedBranchId: BranchId
  address: string
  regionalCity?: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedBranchId', id: BranchId): void
  (e: 'update:address', addr: string): void
  (e: 'quoteUpdated', quote: { fee: number; time: string }): void
}>()

const sampleAddresses = [
  'ილია ჭავჭავაძის გამზ. 37',
  'შოთა რუსთაველის გამზ. 22',
  'ალექსანდრე ყაზბეგის გამზ. 14',
]

const isCalculatingQuote = ref(false)
const quoteResult = ref(true)

function onAddressInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:address', val)
}

function selectSampleAddress(addr: string) {
  emit('update:address', addr)
  calculateWoltQuote()
}

function selectBranch(id: BranchId) {
  emit('update:selectedBranchId', id)
}

function calculateWoltQuote() {
  isCalculatingQuote.value = true
  setTimeout(() => {
    isCalculatingQuote.value = false
    quoteResult.value = true
    emit('quoteUpdated', { fee: 4.50, time: '~35-40 წთ' })
  }, 1000)
}
</script>

