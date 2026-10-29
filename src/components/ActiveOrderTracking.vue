<template>
  <div v-if="order" class="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900/40 shadow-lg relative overflow-hidden space-y-6">
    <!-- Glow element -->
    <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

    <!-- Header with Live Pulse & Order Number -->
    <div class="flex flex-wrap items-center justify-between gap-3 relative z-10">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
          <Bike class="w-4 h-4" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">აქტიური მიწოდება</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <h4 class="text-sm font-bold text-white">შეკვეთა #{{ order.orderId }}</h4>
        </div>
      </div>

      <!-- ETA Badge -->
      <div class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-300">
        <Clock class="w-3.5 h-3.5 text-emerald-400" />
        <span>სავარაუდო მიტანის დრო: 25 წთ</span>
      </div>
    </div>

    <!-- 4-STEP VISUAL TIMELINE -->
    <div class="relative z-10 pt-2">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
        <!-- Connecting Line for Desktop -->
        <div class="hidden md:block absolute top-4 left-8 right-8 h-0.5 bg-slate-800 -z-0">
          <div class="h-full bg-emerald-500 w-[68%] transition-all"></div>
        </div>

        <!-- Step 1: შეკვეთა მიღებულია -->
        <div class="flex flex-col items-start md:items-center text-left md:text-center relative z-10">
          <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md mb-2">
            <Check class="w-4 h-4 stroke-[3]" />
          </div>
          <div class="text-xs font-bold text-white">შეკვეთა მიღებულია</div>
          <div class="text-[11px] text-slate-400">14:20 • დადასტურებული</div>
        </div>

        <!-- Step 2: მზადდება აფთიაქში -->
        <div class="flex flex-col items-start md:items-center text-left md:text-center relative z-10">
          <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md mb-2">
            <Check class="w-4 h-4 stroke-[3]" />
          </div>
          <div class="text-xs font-bold text-white">მზადდება აფთიაქში</div>
          <div class="text-[11px] text-slate-400">14:25 • დაფასოებული</div>
        </div>

        <!-- Step 3: კურიერი გზაშია (აქტიური) -->
        <div class="flex flex-col items-start md:items-center text-left md:text-center relative z-10">
          <div class="relative mb-2">
            <span class="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping"></span>
            <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg relative z-10">
              <Bike class="w-4 h-4" />
            </div>
          </div>
          <div class="text-xs font-bold text-emerald-400">კურიერი გზაშია</div>
          <div class="text-[11px] text-emerald-300/80 font-medium">აქტიური მარშრუტი</div>
        </div>

        <!-- Step 4: ჩაბარებულია -->
        <div class="flex flex-col items-start md:items-center text-left md:text-center relative z-10 opacity-60">
          <div class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center mb-2">
            <Circle class="w-3.5 h-3.5" />
          </div>
          <div class="text-xs font-bold text-slate-300">ჩაბარებულია</div>
          <div class="text-[11px] text-slate-500">დანიშნულების ადგილი</div>
        </div>
      </div>
    </div>

    <!-- Footer Action Bar: Delivery details + Wolt Live Tracking Button -->
    <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
      <div class="text-xs text-slate-300">
        <span class="text-slate-400 block text-[11px]">მიტანის მისამართი:</span>
        <strong class="text-white">{{ order.deliveryAddress }}</strong>
      </div>

      <a
        :href="order.woltTrackingUrl || 'https://wolt.com'"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
      >
        <span>Live Tracking რუკა</span>
        <ExternalLink class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderResult } from '../types'
import {
  Bike,
  Check,
  Circle,
  Clock,
  ExternalLink,
} from 'lucide-vue-next'

defineProps<{
  order: OrderResult
}>()
</script>

