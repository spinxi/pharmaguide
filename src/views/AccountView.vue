<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
    <!-- Breadcrumb & Page Title (Clean, light aesthetic) -->
    <div class="mb-8">
      <nav class="flex items-center gap-2 text-xs text-slate-400 mb-2">
        <router-link to="/" class="hover:text-brand-600 transition-colors">მთავარი</router-link>
        <span>/</span>
        <span class="text-slate-800 font-semibold">ჩემი კაბინეტი</span>
      </nav>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ჩემი კაბინეტი
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
            მართეთ თქვენი შეკვეთები, ონლაინ თრექინგი და საკონტაქტო მონაცემები
          </p>
        </div>

        <!-- User Profile Pill -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-brand-600"></span>
          <span class="text-slate-500">მომხმარებელი:</span>
          <strong class="text-slate-900">{{ store.user.name }}</strong>
        </div>
      </div>
    </div>

    <!-- Main Account Grid with 3-tab Sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- SIDEBAR: Exactly 3 Tabs -->
      <aside class="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-2 sticky top-24">
        <!-- Tab 1: შეკვეთების ისტორია -->
        <button
          @click="activeTab = 'orders'"
          class="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
          :class="[
            activeTab === 'orders'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <div class="flex items-center gap-3">
            <Package class="w-4 h-4" />
            <span>შეკვეთების ისტორია</span>
          </div>

          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700'"
          >
            {{ store.orders.length }}
          </span>
        </button>

        <!-- Tab 2: შენახული მისამართები -->
        <button
          @click="activeTab = 'addresses'"
          class="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
          :class="[
            activeTab === 'addresses'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <div class="flex items-center gap-3">
            <MapPin class="w-4 h-4" />
            <span>შენახული მისამართები</span>
          </div>
        </button>

        <!-- Tab 3: პროფილი -->
        <button
          @click="activeTab = 'profile'"
          class="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
          :class="[
            activeTab === 'profile'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <div class="flex items-center gap-3">
            <User class="w-4 h-4" />
            <span>პროფილი</span>
          </div>
        </button>
      </aside>

      <!-- CONTENT PANELS -->
      <div class="lg:col-span-8 space-y-6">
        <!-- TAB 1: შეკვეთების ისტორია (With Active / Finished Orders Filter) -->
        <div v-if="activeTab === 'orders'" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 class="text-base font-bold text-slate-900">
                შეკვეთების ისტორია
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                თქვენი შეკვეთების ისტორია
              </p>
            </div>

            <!-- Active / Finished Orders Filter Tabs -->
            <div class="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 self-start sm:self-auto text-xs">
              <button
                @click="orderFilter = 'all'"
                class="px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="orderFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'"
              >
                <span>ყველა</span>
                <span
                  class="text-[10px] px-1.5 py-0.2 rounded-full font-bold"
                  :class="orderFilter === 'all' ? 'bg-slate-100 text-slate-700' : 'bg-white/60 text-slate-500'"
                >
                  {{ store.orders.length }}
                </span>
              </button>

              <button
                @click="orderFilter = 'active'"
                class="px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="orderFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="[
                    orderFilter === 'active' ? 'bg-white' : 'bg-emerald-500',
                    activeOrdersCount > 0 ? 'animate-pulse' : ''
                  ]"
                ></span>
                <span>მიმდინარე</span>
                <span
                  class="text-[10px] px-1.5 py-0.2 rounded-full font-bold"
                  :class="orderFilter === 'active' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-800'"
                >
                  {{ activeOrdersCount }}
                </span>
              </button>

              <button
                @click="orderFilter = 'finished'"
                class="px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="orderFilter === 'finished'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'"
              >
                <span>შესრულებული</span>
                <span
                  class="text-[10px] px-1.5 py-0.2 rounded-full font-bold"
                  :class="orderFilter === 'finished' ? 'bg-slate-100 text-slate-700' : 'bg-white/60 text-slate-500'"
                >
                  {{ finishedOrdersCount }}
                </span>
              </button>
            </div>
          </div>

          <!-- Orders Cards -->
          <div class="space-y-4">
            <!-- Empty Filter State -->
            <div
              v-if="filteredOrders.length === 0"
              class="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3"
            >
              <div class="w-12 h-12 rounded-full bg-white text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
                <Package class="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800">
                  {{ orderFilter === 'active' ? 'მიმდინარე შეკვეთები არ გაქვთ' : 'შესრულებული შეკვეთები არ მოიძებნა' }}
                </p>
                <p class="text-[11px] text-slate-400 mt-0.5">
                  {{ orderFilter === 'active' ? 'აქ გამოჩნდება თქვენი ახალი შეკვეთები და თრექინგი' : 'ისტორიაში არ იძებნება ჩაბარებული შეკვეთები' }}
                </p>
              </div>
              <button
                v-if="orderFilter !== 'all'"
                @click="orderFilter = 'all'"
                class="px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-brand-700 transition-colors cursor-pointer shadow-2xs"
              >
                ყველა შეკვეთის ნახვა
              </button>
            </div>

            <!-- Order Cards List -->
            <div
              v-for="order in filteredOrders"
              :key="order.orderId"
              class="p-5 rounded-2xl border transition-all bg-slate-50/40 space-y-3.5"
              :class="order.orderStatus === 'courier_on_the_way' ? 'border-emerald-300 ring-2 ring-emerald-100/80 bg-emerald-50/20' : 'border-slate-200/90 hover:border-slate-300'"
            >
              <!-- Card Header (ID, Date, Method, Status, Price) -->
              <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex flex-wrap items-center gap-2.5">
                  <span class="font-mono font-bold text-slate-900 text-sm">#{{ order.orderId }}</span>
                  <span class="text-slate-400">• {{ order.dateStr || 'დღეს' }}</span>

                  <!-- Method tag -->
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    :class="order.fulfillmentType === 'wolt_delivery' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-700'"
                  >
                    {{
                      order.fulfillmentType === 'wolt_delivery'
                        ? 'Wolt Drive ექსპრესი'
                        : order.fulfillmentType === 'regional_delivery'
                          ? 'რეგიონული მიწოდება'
                          : 'ფილიალიდან გატანა'
                    }}
                  </span>

                  <!-- Status badge -->
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    :class="getOrderStatusClass(order)"
                  >
                    {{ getOrderStatusLabel(order) }}
                  </span>
                </div>

                <div class="flex items-center gap-3">
                  <!-- Prominent Wolt Tracking Button in header if active -->
                  <button
                    v-if="order.fulfillmentType === 'wolt_delivery' && order.orderStatus === 'courier_on_the_way'"
                    @click="openTrackingModal('wolt', order)"
                    class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <ExternalLink class="w-3.5 h-3.5" />
                    <span>Wolt Tracking რუკა</span>
                  </button>

                  <div class="text-right font-black text-slate-900 text-sm">
                    {{ order.total.toFixed(2) }} ₾
                  </div>
                </div>
              </div>

              <!-- INLINE 4-STEP HORIZONTAL TRACKER EMBEDDED DIRECTLY INSIDE ACTIVE ORDER CARD -->
              <div
                v-if="order.orderStatus === 'courier_on_the_way'"
                class="p-4 rounded-xl bg-white border border-emerald-200 space-y-3 shadow-2xs"
              >
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span class="font-bold text-emerald-950">კურიერი გზაშია თქვენი მისამართისკენ</span>
                    <span class="text-[11px] text-emerald-700 font-medium hidden sm:inline">(სავარაუდო დრო: ~25 წთ)</span>
                  </div>

                  <span class="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Wolt Live
                  </span>
                </div>

                <!-- 4-Step Horizontal Progress Tracker: მიღებულია -> მზადდება -> კურიერი გზაშია -> ჩაბარებულია -->
                <div class="grid grid-cols-4 gap-2 text-center pt-1 relative">
                  <!-- Step 1: მიღებულია -->
                  <div class="space-y-1">
                    <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-2xs">
                      <Check class="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div class="text-[10px] sm:text-[11px] font-bold text-slate-800">მიღებულია</div>
                  </div>

                  <!-- Step 2: მზადდება -->
                  <div class="space-y-1">
                    <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-2xs">
                      <Check class="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div class="text-[10px] sm:text-[11px] font-bold text-slate-800">მზადდება</div>
                  </div>

                  <!-- Step 3: კურიერი გზაშია (Active Pulse) -->
                  <div class="space-y-1">
                    <div class="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md ring-4 ring-emerald-100">
                      <Clock class="w-3.5 h-3.5" />
                    </div>
                    <div class="text-[10px] sm:text-[11px] font-black text-brand-700">კურიერი გზაშია</div>
                  </div>

                  <!-- Step 4: ჩაბარებულია -->
                  <div class="space-y-1 opacity-40">
                    <div class="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                      <Circle class="w-3 h-3" />
                    </div>
                    <div class="text-[10px] sm:text-[11px] font-medium text-slate-600">ჩაბარებულია</div>
                  </div>
                </div>
              </div>

              <!-- CONTEXT-AWARE TRACKING & STATUS ROW (For Completed / Regional / Pickup Orders) -->
              <div
                v-else
                class="p-3 rounded-xl bg-white border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <!-- TYPE A: Wolt Drive Delivered -->
                <template v-if="order.fulfillmentType === 'wolt_delivery'">
                  <div class="flex items-center gap-1.5 text-slate-600">
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                    <span class="font-medium">ჩაბარებულია კურიერის მიერ</span>
                  </div>
                </template>

                <!-- TYPE B: Regional Delivery (საქართველოს ფოსტა) -->
                <template v-else-if="order.fulfillmentType === 'regional_delivery'">
                  <div class="flex items-center gap-2">
                    <Truck class="w-4 h-4 text-blue-600" />
                    <span class="text-slate-600">
                      გზავნილის კოდი: <strong class="font-mono text-slate-900">{{ order.postalTrackingCode || 'GEO-894129' }}</strong>
                    </span>
                  </div>

                  <button
                    @click="openTrackingModal('postal', order)"
                    class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Truck class="w-3.5 h-3.5 text-blue-700" />
                    <span>ამანათის თრექინგი</span>
                  </button>
                </template>

                <!-- TYPE C: Branch Pickup (Click & Collect) -->
                <template v-else>
                  <!-- If Status is "მზადაა გასატანად" -->
                  <div v-if="order.orderStatus === 'ready_for_pickup'" class="flex flex-wrap items-center gap-2.5">
                    <div class="flex items-center gap-1.5">
                      <Store class="w-3.5 h-3.5 text-brand-600" />
                      <span class="text-slate-600">
                        შეკვეთა გელოდებათ: <strong class="text-brand-900">{{ order.branch?.nameKa || 'ვაჟა-ფშაველას ფილიალში' }}</strong>
                      </span>
                    </div>
                    <span class="px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200 font-bold text-[11px] text-brand-800 font-mono">
                      კოდი: {{ order.pickupCode || '4910' }}
                    </span>
                  </div>

                  <!-- If Status is "შესრულებული" -->
                  <div v-else class="flex items-center gap-1.5 text-slate-600">
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                    <span class="font-medium">გატანილია ფილიალიდან</span>
                  </div>
                </template>
              </div>

              <!-- Items Summary -->
              <div class="space-y-1.5 pt-1 text-xs">
                <div
                  v-for="item in order.items"
                  :key="item.product.id"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <img :src="item.product.image" @error="handleImageError" class="w-7 h-7 rounded-lg object-cover border border-slate-200" />
                    <div>
                      <span class="font-bold text-slate-900">{{ item.product.shortName }}</span>
                      <span class="text-slate-400 text-[11px] ml-1.5">({{ item.quantity }}x)</span>
                    </div>
                  </div>
                  <span class="text-slate-600 font-medium">{{ (item.product.price * item.quantity).toFixed(2) }} ₾</span>
                </div>
              </div>

              <!-- Action Buttons: "დეტალები" and "ხელახლა შეკვეთა" (Kept on ALL cards) -->
              <div class="pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
                <div class="text-[11px] text-slate-500">
                  <span v-if="order.fulfillmentType === 'click_and_collect'">
                    ფილიალი: {{ order.branch?.nameKa }}
                  </span>
                  <span v-else>
                    მისამართი: {{ order.deliveryAddress }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <!-- Button 1: "დეტალები" -->
                  <button
                    @click="openOrderDetails(order)"
                    class="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Eye class="w-3.5 h-3.5 text-slate-500" />
                    <span>დეტალები</span>
                  </button>

                  <!-- Button 2: "ხელახლა შეკვეთა" -->
                  <button
                    @click="handleReorder(order.orderId)"
                    class="px-3.5 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <RefreshCw class="w-3.5 h-3.5 text-brand-600" />
                    <span>ხელახლა შეკვეთა</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: შენახული მისამართები -->
        <div v-if="activeTab === 'addresses'" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-base font-bold text-slate-900">
              შენახული მისამართები
            </h3>
          </div>

          <div class="space-y-3 text-xs">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
              <div class="flex items-start gap-3">
                <MapPin class="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <div class="font-bold text-slate-900">ძირითადი მისამართი (ბინა)</div>
                  <div class="text-slate-600 mt-0.5">{{ store.user.defaultAddress }}</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700">
                ნაგულისხმევი
              </span>
            </div>
          </div>
        </div>

        <!-- TAB 3: პროფილი -->
        <div v-if="activeTab === 'profile'" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 class="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            პირადი პროფილი
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block text-slate-400 mb-1">სრული სახელი</label>
              <div class="font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {{ store.user.name }}
              </div>
            </div>

            <div>
              <label class="block text-slate-400 mb-1">პირადი ნომერი</label>
              <div class="font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono">
                {{ store.user.personalId }}
              </div>
            </div>

            <div>
              <label class="block text-slate-400 mb-1">მობილური ტელეფონი</label>
              <div class="font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono">
                {{ store.user.phone }}
              </div>
            </div>

            <div>
              <label class="block text-slate-400 mb-1">ელექტრონული ფოსტა</label>
              <div class="font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {{ store.user.email }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ORDER DETAILS MODAL -->
    <OrderDetailsModal
      :is-open="isDetailsModalOpen"
      :order="selectedOrderForModal"
      @close="isDetailsModalOpen = false"
    />

    <!-- TRACKING MODAL (Wolt Live Tracking / Postal Tracking) -->
    <TrackingModal
      :is-open="isTrackingModalOpen"
      :tracking-data="activeTrackingData"
      @close="isTrackingModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePharmacyStore } from '../stores/pharmacyStore'
import { handleImageError } from '../utils/imageFallback'
import OrderDetailsModal from '../components/OrderDetailsModal.vue'
import TrackingModal, { type TrackingData } from '../components/TrackingModal.vue'
import type { OrderResult } from '../types'
import {
  Package,
  User,
  Clock,
  RefreshCw,
  MapPin,
  Eye,
  Check,
  Circle,
  ExternalLink,
  Truck,
  Store,
  CheckCircle2,
} from 'lucide-vue-next'

const store = usePharmacyStore()

const activeTab = ref<'orders' | 'addresses' | 'profile'>('orders')
const orderFilter = ref<'all' | 'active' | 'finished'>('all')

const activeOrdersCount = computed(() => {
  return store.orders.filter(o => o.orderStatus !== 'delivered').length
})

const finishedOrdersCount = computed(() => {
  return store.orders.filter(o => o.orderStatus === 'delivered').length
})

const filteredOrders = computed(() => {
  if (orderFilter.value === 'active') {
    return store.orders.filter(o => o.orderStatus !== 'delivered')
  }
  if (orderFilter.value === 'finished') {
    return store.orders.filter(o => o.orderStatus === 'delivered')
  }
  return store.orders
})

const isDetailsModalOpen = ref(false)
const selectedOrderForModal = ref<OrderResult | null>(null)

// Tracking Modal state
const isTrackingModalOpen = ref(false)
const activeTrackingData = ref<TrackingData | null>(null)

function openOrderDetails(order: OrderResult) {
  selectedOrderForModal.value = order
  isDetailsModalOpen.value = true
}

function getOrderStatusLabel(order: OrderResult): string {
  if (order.fulfillmentType === 'click_and_collect') {
    if (order.orderStatus === 'ready_for_pickup') return 'მზადაა ფილიალში'
    if (order.orderStatus === 'delivered') return 'გატანილია'
    return 'მზადდება გასატანად'
  }
  if (order.orderStatus === 'courier_on_the_way') return 'გზაშია'
  if (order.orderStatus === 'delivered') return 'ჩაბარებულია'
  if (order.fulfillmentType === 'regional_delivery') return 'მუშავდება'
  return 'მზადდება'
}

function getOrderStatusClass(order: OrderResult): string {
  if (order.fulfillmentType === 'click_and_collect') {
    if (order.orderStatus === 'ready_for_pickup') return 'bg-emerald-100 text-emerald-900 border border-emerald-200'
    if (order.orderStatus === 'delivered') return 'bg-slate-100 text-slate-700'
    return 'bg-amber-100 text-amber-900 border border-amber-200'
  }
  if (order.orderStatus === 'courier_on_the_way') return 'bg-amber-100 text-amber-900 border border-amber-200'
  if (order.orderStatus === 'delivered') return 'bg-emerald-100 text-emerald-900'
  return 'bg-slate-100 text-slate-700'
}

function openTrackingModal(type: 'wolt' | 'postal', order: OrderResult) {
  activeTrackingData.value = {
    type,
    orderId: order.orderId,
    deliveryAddress: order.deliveryAddress || 'თბილისი',
    postalTrackingCode: order.postalTrackingCode || 'GEO-894129',
  }
  isTrackingModalOpen.value = true
}

function handleReorder(orderId: string) {
  store.refillOrder(orderId)
  store.isCartDrawerOpen = true
}
</script>
