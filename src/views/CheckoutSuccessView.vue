<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
    <div class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm animate-in fade-in duration-300">
      <!-- Animated Success Header -->
      <div class="bg-gradient-to-b from-emerald-50/70 to-white p-8 sm:p-10 text-center border-b border-slate-100">
        <!-- Animated Bouncing / Scaling Checkmark SVG -->
        <div class="w-20 h-20 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-inner animate-bounce">
          <div class="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Check class="w-8 h-8 stroke-[3]" />
          </div>
        </div>

        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          შეკვეთა მიღებულია!
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
          დეტალები და თრექინგის ინფორმაცია გამოგეგზავნათ SMS-ით ნომერზე: <span class="font-bold text-slate-800">{{ latestOrder.customer.phone }}</span>
        </p>
      </div>

      <!-- Order Summary Card -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Key Meta Row -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold">შეკვეთის ნომერი</span>
            <span class="font-mono font-bold text-slate-900 text-sm">#{{ latestOrder.orderId }}</span>
          </div>

          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold">სტატუსი</span>
            <span class="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-0.5 border border-emerald-200">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              მიღებულია
            </span>
          </div>

          <div class="col-span-2 sm:col-span-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold">მეთოდი</span>
            <span class="font-bold text-slate-900">
              {{
                latestOrder.fulfillmentType === 'wolt_delivery'
                  ? 'ექსპრეს მიწოდება (Wolt)'
                  : latestOrder.fulfillmentType === 'regional_delivery'
                    ? 'რეგიონული მიწოდება'
                    : 'ფილიალიდან გატანა'
              }}
            </span>
          </div>
        </div>

        <!-- Time & Address Banner -->
        <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
          <div class="flex items-center gap-2 text-emerald-900 font-bold">
            <Clock class="w-4 h-4 text-emerald-700" />
            <span v-if="latestOrder.fulfillmentType === 'wolt_delivery'">
              სავარაუდო მიწოდების დრო: ~40 წუთი
            </span>
            <span v-else-if="latestOrder.fulfillmentType === 'click_and_collect'">
              მზადყოფნის დრო: ~15 წუთი (შერჩეულ ფილიალში)
            </span>
            <span v-else>
              სავარაუდო მიწოდების დრო: 2-3 სამუშაო დღე
            </span>
          </div>

          <div class="flex items-center gap-2 text-slate-700 pt-1 border-t border-emerald-100">
            <MapPin class="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span v-if="latestOrder.fulfillmentType === 'click_and_collect'">
              ფილიალი: {{ latestOrder.branch?.nameKa }} ({{ latestOrder.branch?.addressKa }})
            </span>
            <span v-else>
              მისამართი: {{ latestOrder.deliveryAddress }}
            </span>
          </div>
        </div>

        <!-- Ordered Items Brief List -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">
            შეკვეთილი პროდუქტები
          </h4>
          <div class="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2 text-xs">
            <div
              v-for="item in latestOrder.items"
              :key="item.product.id"
              class="py-2.5 px-2 flex items-center justify-between"
            >
              <div class="flex items-center gap-2.5">
                <img :src="item.product.image" @error="handleImageError" class="w-8 h-8 rounded-lg object-cover border border-slate-100" />
                <div>
                  <span class="font-bold text-slate-900">{{ item.product.shortName }}</span>
                  <span class="text-slate-400 text-[11px] ml-1.5">× {{ item.quantity }}</span>
                </div>
              </div>
              <span class="font-bold text-slate-900">{{ (item.product.price * item.quantity).toFixed(2) }} ₾</span>
            </div>

            <div class="py-2.5 px-2 flex justify-between font-bold text-slate-900 pt-3">
              <span>ჯამური თანხა:</span>
              <span class="text-brand-600 text-sm">{{ latestOrder.total.toFixed(2) }} ₾</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <router-link
            to="/account"
            class="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Radio class="w-4 h-4" />
            <span>შეკვეთის თრექინგი</span>
          </router-link>

          <router-link
            to="/"
            class="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition-colors cursor-pointer"
          >
            მთავარ გვერდზე დაბრუნება
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePharmacyStore } from '../stores/pharmacyStore'
import { handleImageError } from '../utils/imageFallback'
import {
  Check,
  MapPin,
  Clock,
  Radio,
} from 'lucide-vue-next'

const store = usePharmacyStore()

const latestOrder = computed(() => {
  return store.completedOrder || store.orders[0]
})
</script>