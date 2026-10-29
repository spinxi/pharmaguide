<template>
  <div class="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 md:p-8 font-sans">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- 1. CLEAN HEADER -->
      <header class="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4">
        <!-- Left: Clean Logo -->
        <router-link to="/" class="shrink-0 flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-500 transition-colors">
            <span class="font-black text-sm">PG</span>
          </div>
          <span class="text-base font-black tracking-tight text-slate-900">ფარმაგიდი</span>
        </router-link>

        <!-- Right: Simple Branch Switcher & Back Button -->
        <div class="flex items-center gap-3">
          <!-- Simple Branch Dropdown -->
          <div class="relative">
            <select
              v-model="selectedBranch"
              class="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-600 cursor-pointer"
            >
              <option value="lubliana">ლუბლიანას ფილიალი ▾</option>
              <option value="vazha">ვაჟა-ფშაველას ფილიალი ▾</option>
              <option value="tsereteli">წერეთლის ფილიალი ▾</option>
            </select>
          </div>

          <!-- Back to Storefront -->
          <router-link
            to="/"
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>საიტზე დაბრუნება</span>
          </router-link>
        </div>
      </header>

      <!-- 2. OPERATIONAL TABS & COMPACT SEARCH BAR -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Two Operational Tabs (Exact Counts) -->
        <div class="flex items-center gap-2.5 w-full sm:w-auto">
          <!-- Tab 1: Wolt Delivery -->
          <button
            @click="activeTab = 'wolt'"
            class="flex-1 sm:flex-initial px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            :class="activeTab === 'wolt'
              ? 'bg-brand-600 text-white shadow-brand-600/20'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'"
          >
            <Bike class="w-4 h-4" />
            <span>Wolt-ის მიწოდება</span>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-extrabold"
              :class="activeTab === 'wolt' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'"
            >
              {{ woltOrdersCount }}
            </span>
          </button>

          <!-- Tab 2: Branch Pickup -->
          <button
            @click="activeTab = 'pickup'"
            class="flex-1 sm:flex-initial px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            :class="activeTab === 'pickup'
              ? 'bg-brand-600 text-white shadow-brand-600/20'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'"
          >
            <Store class="w-4 h-4" />
            <span>ფილიალიდან გატანა</span>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-extrabold"
              :class="activeTab === 'pickup' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'"
            >
              {{ pickupOrdersCount }}
            </span>
          </button>
        </div>

        <!-- Compact Search Box -->
        <div class="relative w-full sm:w-80">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="terminalSearchQuery"
            type="text"
            placeholder="ძებნა კოდით (მაგ: 4910) ან ტელეფონით..."
            class="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600 text-slate-800 placeholder:text-slate-400 shadow-xs"
          />
        </div>
      </div>

      <!-- 3. OPTIMIZED 2-COLUMN ORDER CARDS -->

      <!-- TAB 1: Wolt-ის მიწოდება -->
      <div v-if="activeTab === 'wolt'" class="space-y-4">
        <!-- CARD 1: Needs Courier (#PG-904120) -->
        <div
          v-if="isWoltCard1Visible && !woltCard1Dismissed"
          class="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
        >
          <!-- Left Side: Customer name, phone, address, and bulleted products list -->
          <div class="flex-1 space-y-3.5 min-w-0">
            <!-- Header ID -->
            <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span class="font-mono font-black text-sm text-slate-900">#PG-904120</span>
              <span>•</span>
              <span>3 წუთის წინ</span>
            </div>

            <!-- Customer & Address -->
            <div class="space-y-1">
              <div class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <User class="w-4 h-4 text-slate-400 shrink-0" />
                <span>გიორგი მაისურაძე</span>
                <a href="tel:+995599123456" class="text-xs text-brand-600 font-mono font-medium hover:underline">
                  (+995 599 12 34 56)
                </a>
              </div>

              <div class="text-sm text-slate-600 flex items-center gap-2">
                <MapPin class="w-4 h-4 text-slate-400 shrink-0" />
                <span class="font-medium">ი. ჭავჭავაძის გამზ. 37, ბინა 42</span>
              </div>
            </div>

            <!-- Products Bullet List -->
            <div class="pt-1">
              <ul class="space-y-1.5 text-sm sm:text-base font-semibold text-slate-800">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-brand-500 shrink-0"></span>
                  <span>დეტრალექსი 1000მგ №30</span>
                  <span class="text-slate-400 font-normal text-xs sm:text-sm">(1 ცალი)</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-brand-500 shrink-0"></span>
                  <span>La Roche-Posay Cicaplast B5+ 40მლ</span>
                  <span class="text-slate-400 font-normal text-xs sm:text-sm">(1 ცალი)</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Right Side: Clean Price & Action Button Underneath -->
          <div class="md:w-80 shrink-0 flex flex-col items-start md:items-end justify-between self-stretch gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div class="md:text-right">
              <div class="text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                88.20 <span class="font-bold">₾</span>
              </div>
            </div>

            <!-- Action Button / Called Status (Auto-width, self-end) -->
            <div class="w-full md:w-auto flex md:justify-end">
              <!-- State B: Courier Called Blue Card -->
              <div
                v-if="woltCard1Called"
                class="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-start md:items-end gap-2 text-right animate-in fade-in duration-200"
              >
                <div class="flex items-center gap-2 text-blue-900 font-bold text-xs sm:text-sm">
                  <CheckCircle2 class="w-4 h-4 text-blue-600 shrink-0" />
                  <span>კურიერი გამოძახებულია (~10 წთ)</span>
                </div>

                <button
                  @click="openWoltTrackingModal('PG-904120', 'ი. ჭავჭავაძის გამზ. 37, ბინა 42')"
                  class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink class="w-3.5 h-3.5" />
                  <span>კურიერის თვალყურის დევნება</span>
                </button>
              </div>

              <!-- State A: ONE BIG BUTTON (Auto-width, high contrast) -->
              <button
                v-else
                @click="callWoltCourierCard1"
                :disabled="woltCard1Loading"
                class="w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 active:scale-98 transition-all cursor-pointer self-end"
              >
                <Loader2 v-if="woltCard1Loading" class="w-4 h-4 animate-spin" />
                <Bike v-else class="w-5 h-5" />
                <span>{{ woltCard1Loading ? 'გამოძახება...' : 'Wolt კურიერის გამოძახება' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- CARD 2: Courier on the way (#PG-889102) -->
        <div
          v-if="isWoltCard2Visible && woltCard2Delivered"
          class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center justify-between animate-in fade-in duration-200"
        >
          <div class="flex items-center gap-2.5">
            <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0" />
            <span class="text-sm sm:text-base">✓ შეკვეთა #PG-889102 გადაცემულია კურიერისთვის</span>
          </div>
          <span class="text-xs text-emerald-700 font-medium">დავით კაპანაძე • 45.20 ₾</span>
        </div>
        <div
          v-else-if="isWoltCard2Visible"
          class="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
        >
          <!-- Left Side -->
          <div class="flex-1 space-y-3.5 min-w-0">
            <!-- Header ID -->
            <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span class="font-mono font-black text-sm text-slate-900">#PG-889102</span>
              <span>•</span>
              <span>12 წუთის წინ</span>
            </div>

            <!-- Customer & Address -->
            <div class="space-y-1">
              <div class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <User class="w-4 h-4 text-slate-400 shrink-0" />
                <span>დავით კაპანაძე</span>
                <a href="tel:+995591445566" class="text-xs text-brand-600 font-mono font-medium hover:underline">
                  (+995 591 44 55 66)
                </a>
              </div>

              <div class="text-sm text-slate-600 flex items-center gap-2">
                <MapPin class="w-4 h-4 text-slate-400 shrink-0" />
                <span class="font-medium">ვაჟა-ფშაველას გამზ. 20, ბინა 15</span>
              </div>
            </div>

            <!-- Products -->
            <div class="pt-1">
              <ul class="space-y-1.5 text-sm sm:text-base font-semibold text-slate-800">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-brand-500 shrink-0"></span>
                  <span>ნუროფენი ფორტე 400მგ</span>
                  <span class="text-slate-400 font-normal text-xs sm:text-sm">(2 ცალი)</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Right Side: Clean Price, Status, and Active Button "კურიერისთვის გადაცემა" -->
          <div class="md:w-80 shrink-0 flex flex-col items-start md:items-end justify-between self-stretch gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div class="md:text-right">
              <div class="text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                45.20 <span class="font-bold">₾</span>
              </div>
              <div class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mt-1">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>კურიერი ადგილზეა / მოემართება</span>
              </div>
            </div>

            <!-- Action Button: "კურიერისთვის გადაცემა" (Active verb, auto-width) -->
            <div class="w-full md:w-auto flex md:justify-end">
              <button
                @click="markWoltCard2Delivered"
                class="w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-end"
              >
                <Check class="w-5 h-5 stroke-[2.5]" />
                <span>კურიერისთვის გადაცემა</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state when Wolt orders cleared -->
        <div v-if="!isWoltCard1Visible && !isWoltCard2Visible" class="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <p class="text-sm font-bold text-slate-700">შესაბამისი შეკვეთა ვერ მოიძებნა</p>
          <p class="text-xs text-slate-400">შეამოწმეთ შეყვანილი კოდი ან ტელეფონის ნომერი</p>
        </div>
      </div>

      <!-- TAB 2: ფილიალიდან გატანა (2 Mock Orders) -->
      <div v-if="activeTab === 'pickup'" class="space-y-4">
        <!-- CARD 1: Prescription order (#PG-880372) -->
        <div
          v-if="isPickupCard1Visible && pickupCard1Delivered"
          class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center justify-between animate-in fade-in duration-200"
        >
          <div class="flex items-center gap-2.5">
            <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0" />
            <span class="text-sm sm:text-base">✓ შეკვეთა #PG-880372 ჩაბარებულია</span>
          </div>
          <span class="text-xs text-emerald-700 font-medium">ნინო გელოვანი • 22.50 ₾</span>
        </div>
        <div
          v-else-if="isPickupCard1Visible"
          class="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
        >
          <!-- Left Side -->
          <div class="flex-1 space-y-3.5 min-w-0">
            <!-- Header ID with Verification Code Badge -->
            <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <span class="font-mono font-black text-sm text-slate-900">#PG-880372</span>
              <span>•</span>
              <span class="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">კოდი: 4910</span>
              <span>•</span>
              <span>15 წუთის წინ</span>
            </div>

            <!-- Customer -->
            <div class="space-y-1">
              <div class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <User class="w-4 h-4 text-slate-400 shrink-0" />
                <span>ნინო გელოვანი</span>
                <a href="tel:+995577204080" class="text-xs text-brand-600 font-mono font-medium hover:underline">
                  (+995 577 20 40 80)
                </a>
              </div>
            </div>

            <!-- Products list with Prescription Badge next to Augmentin -->
            <div class="pt-1">
              <ul class="space-y-1.5 text-sm sm:text-base font-semibold text-slate-800">
                <li class="flex flex-wrap items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-brand-500 shrink-0"></span>
                  <span>აუგმენტინი 1000მგ №14</span>
                  <span class="text-slate-400 font-normal text-xs sm:text-sm">(1 ცალი)</span>
                  <!-- Yellow Prescription Badge -->
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <AlertTriangle class="w-3.5 h-3.5 text-amber-700" />
                    <span>რეცეპტით</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Right Side: Clean Price & Safety Verification Action Button -->
          <div class="md:w-80 shrink-0 flex flex-col items-start md:items-end justify-between self-stretch gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div class="md:text-right">
              <div class="text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                22.50 <span class="font-bold">₾</span>
              </div>
            </div>

            <!-- Verification Action Button -->
            <div class="w-full md:w-auto flex md:justify-end">
              <button
                @click="completePickupCard1"
                class="w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-end whitespace-nowrap"
              >
                <CheckCircle2 class="w-5 h-5 stroke-[2.5]" />
                <span>რეცეპტი შემოწმებულია • ჩაბარება</span>
              </button>
            </div>
          </div>
        </div>

        <!-- CARD 2: Ready on counter (#PG-880380) -->
        <div
          v-if="isPickupCard2Visible && pickupCard2Delivered"
          class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center justify-between animate-in fade-in duration-200"
        >
          <div class="flex items-center gap-2.5">
            <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0" />
            <span class="text-sm sm:text-base">✓ შეკვეთა #PG-880380 ჩაბარებულია</span>
          </div>
          <span class="text-xs text-emerald-700 font-medium">მარიამ ბერიძე • 47.43 ₾</span>
        </div>
        <div
          v-else-if="isPickupCard2Visible"
          class="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
        >
          <!-- Left Side -->
          <div class="flex-1 space-y-3.5 min-w-0">
            <!-- Header ID with Verification Code Badge -->
            <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <span class="font-mono font-black text-sm text-slate-900">#PG-880380</span>
              <span>•</span>
              <span class="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">კოდი: 7324</span>
              <span>•</span>
              <span>25 წუთის წინ</span>
            </div>

            <!-- Customer -->
            <div class="space-y-1">
              <div class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <User class="w-4 h-4 text-slate-400 shrink-0" />
                <span>მარიამ ბერიძე</span>
                <a href="tel:+995598112233" class="text-xs text-brand-600 font-mono font-medium hover:underline">
                  (+995 598 11 22 33)
                </a>
              </div>
            </div>

            <!-- Products -->
            <div class="pt-1">
              <ul class="space-y-1.5 text-sm sm:text-base font-semibold text-slate-800">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-brand-500 shrink-0"></span>
                  <span>ქანბებე საფენი №44</span>
                  <span class="text-slate-400 font-normal text-xs sm:text-sm">(1 ცალი)</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-brand-500 shrink-0"></span>
                  <span>სუდოკრემი 125გ</span>
                  <span class="text-slate-400 font-normal text-xs sm:text-sm">(1 ცალი)</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Right Side: Clean Price & Action Button -->
          <div class="md:w-80 shrink-0 flex flex-col items-start md:items-end justify-between self-stretch gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div class="md:text-right">
              <div class="text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                47.43 <span class="font-bold">₾</span>
              </div>
            </div>

            <!-- Simple Green Action Button -->
            <div class="w-full md:w-auto flex md:justify-end">
              <button
                @click="completePickupCard2"
                class="w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-end whitespace-nowrap"
              >
                <Check class="w-5 h-5 stroke-[2.5]" />
                <span>შეკვეთის ჩაბარება</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state when search produces no results -->
        <div v-if="!isPickupCard1Visible && !isPickupCard2Visible" class="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <p class="text-sm font-bold text-slate-700">შესაბამისი შეკვეთა ვერ მოიძებნა</p>
          <p class="text-xs text-slate-400">შეამოწმეთ შეყვანილი კოდი (მაგ: 4910) ან ტელეფონი</p>
        </div>
      </div>
    </div>

    <!-- WOLT COURIER LIVE TRACKING MODAL -->
    <TrackingModal
      :is-open="isTrackingModalOpen"
      :tracking-data="activeTrackingData"
      @close="isTrackingModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePharmacyStore } from '../stores/pharmacyStore'
import TrackingModal, { type TrackingData } from '../components/TrackingModal.vue'
import {
  Bike,
  Store,
  ArrowLeft,
  User,
  MapPin,
  Check,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Search,
} from 'lucide-vue-next'

const store = usePharmacyStore()

// State
const selectedBranch = ref('lubliana')
const activeTab = ref<'wolt' | 'pickup'>('wolt')
const terminalSearchQuery = ref('')

// Search Filter Visibilities
const isWoltCard1Visible = computed(() => {
  const q = terminalSearchQuery.value.trim().toLowerCase()
  if (!q) return true
  return 'pg-904120 904120 გიორგი მაისურაძე 599123456 დეტრალექსი cicaplast'.toLowerCase().includes(q)
})

const isWoltCard2Visible = computed(() => {
  const q = terminalSearchQuery.value.trim().toLowerCase()
  if (!q) return true
  return 'pg-889102 889102 დავით კაპანაძე 591445566 ნუროფენი nurofen'.toLowerCase().includes(q)
})

const isPickupCard1Visible = computed(() => {
  const q = terminalSearchQuery.value.trim().toLowerCase()
  if (!q) return true
  return 'pg-880372 880372 4910 ნინო გელოვანი 577204080 აუგმენტინი augmentin'.toLowerCase().includes(q)
})

const isPickupCard2Visible = computed(() => {
  const q = terminalSearchQuery.value.trim().toLowerCase()
  if (!q) return true
  return 'pg-880380 880380 7324 მარიამ ბერიძე 598112233 ქანბებე canbebe სუდოკრემი'.toLowerCase().includes(q)
})

// Auto-switch tab if customer search query clearly belongs to pickup (e.g. pickup code or name)
watch(terminalSearchQuery, (val) => {
  const q = val.trim().toLowerCase()
  if (!q) return
  if (['4910', '7324', 'ნინო', 'მარიამ', 'გელოვანი', 'ბერიძე', '880372', '880380'].some(key => q.includes(key))) {
    activeTab.value = 'pickup'
  } else if (['904120', '889102', 'გიორგი', 'დავით', 'მაისურაძე', 'კაპანაძე'].some(key => q.includes(key))) {
    activeTab.value = 'wolt'
  }
})

// Tracking Modal State
const isTrackingModalOpen = ref(false)
const activeTrackingData = ref<TrackingData | null>(null)

// Wolt Tab State (2 Orders)
const woltCard1Called = ref(false)
const woltCard1Loading = ref(false)
const woltCard1Dismissed = ref(false)
const woltCard2Delivered = ref(false)

const woltOrdersCount = computed(() => {
  let count = 0
  if (!woltCard1Dismissed.value) count++
  if (!woltCard2Delivered.value) count++
  return count
})

function callWoltCourierCard1() {
  woltCard1Loading.value = true
  setTimeout(() => {
    woltCard1Loading.value = false
    woltCard1Called.value = true
    store.showToast(
      'კურიერი გამოძახებულია!',
      'Wolt Drive-ის კურიერი მოვა დაახლოებით 10 წუთში.',
      'success'
    )
  }, 700)
}

function markWoltCard2Delivered() {
  woltCard2Delivered.value = true
  store.showToast(
    'შეკვეთა გადაცემულია!',
    'შეკვეთა #PG-889102 გადაეცა კურიერს.',
    'success'
  )
}

function openWoltTrackingModal(orderId: string, address: string) {
  activeTrackingData.value = {
    type: 'wolt',
    orderId,
    deliveryAddress: address,
    postalTrackingCode: 'WLT-5821',
  }
  isTrackingModalOpen.value = true
}

// Pickup Tab State (2 Orders guaranteed)
const pickupCard1Code = ref('4910')
const pickupCard1Delivered = ref(false)
const pickupCard2Delivered = ref(false)

const pickupOrdersCount = computed(() => {
  let count = 0
  if (!pickupCard1Delivered.value) count++
  if (!pickupCard2Delivered.value) count++
  return count
})

function completePickupCard1() {
  pickupCard1Delivered.value = true
  store.showToast(
    'შეკვეთა ჩაბარებულია!',
    'რეცეპტი დამოწმდა და შეკვეთა #PG-880372 წარმატებით გაიცა.',
    'success'
  )
}

function completePickupCard2() {
  pickupCard2Delivered.value = true
  store.showToast(
    'შეკვეთა ჩაბარებულია!',
    'შეკვეთა #PG-880380 წარმატებით გაიცა მომხმარებელზე.',
    'success'
  )
}
</script>
