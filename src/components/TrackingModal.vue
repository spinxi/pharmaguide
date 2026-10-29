<template>
  <div
    v-if="isOpen && trackingData"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    @click.self="close"
  >
    <div class="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center"
            :class="trackingData.type === 'wolt' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'"
          >
            <Bike v-if="trackingData.type === 'wolt'" class="w-5 h-5" />
            <Truck v-else class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">
              {{ trackingData.type === 'wolt' ? 'Wolt Live Tracking რუკა' : 'ამანათის თრექინგი (საქართველოს ფოსტა)' }}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              შეკვეთა #{{ trackingData.orderId }}
            </p>
          </div>
        </div>

        <button
          @click="close"
          class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-5">
        <!-- 1. Wolt Live Tracking View -->
        <template v-if="trackingData.type === 'wolt'">
          <!-- Live Status Bar -->
          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span class="font-bold text-emerald-950">კურიერი გზაშია თქვენი მისამართისკენ</span>
            </div>
            <span class="font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
              სავარაუდო დრო: ~25 წუთი
            </span>
          </div>

          <!-- Stylized Courier Map Canvas -->
          <div class="relative w-full h-56 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
            <svg class="w-full h-full object-cover" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0f172a" />
                  <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
              </defs>
              <rect width="600" height="300" fill="url(#trackGrad)" />
              <!-- Roads -->
              <path d="M 50 150 Q 250 80, 550 180" stroke="#334155" stroke-width="4" fill="none" />
              <path d="M 150 20 L 300 280" stroke="#334155" stroke-width="2" fill="none" />
              <!-- Courier Route -->
              <path d="M 120 135 Q 260 90, 480 165" stroke="#10b981" stroke-width="3" stroke-dasharray="6,4" fill="none" />
            </svg>

            <!-- Pharmacy Origin Marker -->
            <div class="absolute left-[20%] top-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div class="px-2 py-0.5 rounded bg-emerald-700 text-white text-[9px] font-bold mb-1">
                აფთიაქი
              </div>
              <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-md">
                <Store class="w-3.5 h-3.5" />
              </div>
            </div>

            <!-- Moving Rider Marker -->
            <div class="absolute left-[50%] top-[38%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xl animate-bounce">
                <Bike class="w-4 h-4" />
              </div>
              <div class="px-2 py-0.5 rounded bg-black/80 text-emerald-300 text-[9px] font-bold mt-1">
                კურიერი დავითი
              </div>
            </div>

            <!-- Customer Destination Marker -->
            <div class="absolute left-[80%] top-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div class="relative">
                <span class="absolute -inset-2 rounded-full bg-emerald-400/30 animate-ping"></span>
                <div class="w-7 h-7 rounded-full bg-white border-2 border-brand-600 flex items-center justify-center text-brand-600 shadow-md">
                  <MapPin class="w-3.5 h-3.5" />
                </div>
              </div>
              <div class="px-2 py-0.5 rounded bg-white text-slate-900 text-[9px] font-bold mt-1 shadow-md">
                დანიშნულება
              </div>
            </div>
          </div>

          <!-- Destination details -->
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
            <div>
              <span class="text-slate-400 block text-[10px]">მიტანის მისამართი:</span>
              <strong class="text-slate-800">{{ trackingData.deliveryAddress }}</strong>
            </div>
            <span class="text-[11px] text-slate-500">კურიერის ნომერი: +995 599 ** ** 12</span>
          </div>
        </template>

        <!-- 2. Regional Postal Tracking View -->
        <template v-else>
          <!-- Tracking Header Info -->
          <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
            <div>
              <span class="text-blue-600 block text-[10px] font-bold uppercase tracking-wider">გზავნილის ნომერი</span>
              <strong class="font-mono text-base text-blue-950 font-bold">{{ trackingData.postalTrackingCode || 'GEO-894129' }}</strong>
            </div>
            <div class="text-right">
              <span class="text-slate-400 block text-[10px]">გადამზიდი</span>
              <strong class="text-slate-800">საქართველოს ფოსტა</strong>
            </div>
          </div>

          <!-- Postal Milestone Steps -->
          <div class="space-y-4 pt-2">
            <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
              გზავნილის მოძრაობის ისტორია
            </h4>

            <div class="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <!-- Milestone 1 -->
              <div class="relative flex items-start gap-3 text-xs">
                <span class="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  <Check class="w-3 h-3 stroke-[3]" />
                </span>
                <div>
                  <div class="font-bold text-slate-900">ამანათი მიღებულია სორტირების ცენტრში</div>
                  <div class="text-[11px] text-slate-400">თბილისის ცენტრალური ჰაბი • გუშინ, 10:45</div>
                </div>
              </div>

              <!-- Milestone 2 -->
              <div class="relative flex items-start gap-3 text-xs">
                <span class="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  <Check class="w-3 h-3 stroke-[3]" />
                </span>
                <div>
                  <div class="font-bold text-slate-900">გაგზავნილია რეგიონულ სადისტრიბუციო ცენტრში</div>
                  <div class="text-[11px] text-slate-400">თბილისი - დასავლეთ საქართველოს მიმართულება • გუშინ, 14:30</div>
                </div>
              </div>

              <!-- Milestone 3 (Active) -->
              <div class="relative flex items-start gap-3 text-xs">
                <span class="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] ring-4 ring-blue-100">
                  <Truck class="w-3 h-3" />
                </span>
                <div>
                  <div class="font-bold text-blue-900">გზაშია დანიშნულების ქალაქისკენ (ქუთაისი)</div>
                  <div class="text-[11px] text-blue-600">სავარაუდო ჩაბარება: დღეს 18:00 საათამდე</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Destination details -->
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <span class="text-slate-400 block text-[10px]">ჩაბარების მისამართი:</span>
            <strong class="text-slate-800">{{ trackingData.deliveryAddress }}</strong>
          </div>
        </template>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button
          @click="close"
          class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
        >
          დახურვა
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  X,
  Bike,
  Truck,
  Store,
  MapPin,
  Check,
} from 'lucide-vue-next'

export interface TrackingData {
  type: 'wolt' | 'postal'
  orderId: string
  deliveryAddress: string
  postalTrackingCode?: string
}

defineProps<{
  isOpen: boolean
  trackingData: TrackingData | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  emit('close')
}
</script>

