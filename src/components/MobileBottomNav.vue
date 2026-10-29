<template>
  <!-- Native Mobile App Bottom Navigation Bar -->
  <nav
    class="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    aria-label="მობილური ნავიგაცია"
  >
    <div class="grid grid-cols-5 items-center h-16 px-1">
      <!-- 1. მთავარი (Home) -->
      <router-link
        to="/"
        class="flex flex-col items-center justify-center gap-1 py-1 transition-all active:scale-90 select-none group"
        :class="$route.path === '/' ? 'text-brand-700 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-medium'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          :class="$route.path === '/' ? 'bg-brand-50 text-brand-700' : 'text-slate-500'"
        >
          <Home class="w-5 h-5 stroke-[2.2]" />
        </div>
        <span class="text-[10px] leading-none tracking-tight">მთავარი</span>
      </router-link>

      <!-- 2. კატალოგი (Catalog) -->
      <router-link
        to="/category/medicines"
        class="flex flex-col items-center justify-center gap-1 py-1 transition-all active:scale-90 select-none group"
        :class="$route.path.startsWith('/category') ? 'text-brand-700 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-medium'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          :class="$route.path.startsWith('/category') ? 'bg-brand-50 text-brand-700' : 'text-slate-500'"
        >
          <LayoutGrid class="w-5 h-5 stroke-[2.2]" />
        </div>
        <span class="text-[10px] leading-none tracking-tight">კატალოგი</span>
      </router-link>

      <!-- 3. კალათა (Cart with Live Counter Badge) -->
      <button
        @click="store.isCartDrawerOpen = true"
        class="flex flex-col items-center justify-center gap-1 py-1 transition-all active:scale-90 select-none cursor-pointer group"
        :class="store.isCartDrawerOpen ? 'text-brand-700 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-medium'"
      >
        <div class="relative w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-brand-600">
          <div
            v-if="store.cartItemCount > 0"
            class="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs"
          >
            <ShoppingBag class="w-4 h-4 stroke-[2.5]" />
          </div>
          <ShoppingBag v-else class="w-5 h-5 stroke-[2.2]" />

          <!-- Dynamic Count Pill -->
          <span
            v-if="store.cartItemCount > 0"
            class="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-2xs animate-in zoom-in-50 duration-150"
          >
            {{ store.cartItemCount }}
          </span>
        </div>
        <span class="text-[10px] leading-none tracking-tight">კალათა</span>
      </button>

      <!-- 4. შეკვეთები (Orders Tracker / History) -->
      <router-link
        to="/account"
        class="flex flex-col items-center justify-center gap-1 py-1 transition-all active:scale-90 select-none group"
        :class="$route.path === '/account' ? 'text-brand-700 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-medium'"
      >
        <div
          class="relative w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          :class="$route.path === '/account' ? 'bg-brand-50 text-brand-700' : 'text-slate-500'"
        >
          <Clock class="w-5 h-5 stroke-[2.2]" />
          <!-- Active order pulse dot if has active orders -->
          <span
            v-if="hasActiveOrder"
            class="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse"
          ></span>
        </div>
        <span class="text-[10px] leading-none tracking-tight">შეკვეთები</span>
      </router-link>

      <!-- 5. AI კონსულტანტი (AI Assistant) -->
      <button
        @click="toggleAi"
        class="flex flex-col items-center justify-center gap-1 py-1 transition-all active:scale-90 select-none cursor-pointer group"
        :class="store.isAiAssistantOpen ? 'text-brand-700 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-medium'"
      >
        <div
          class="relative w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          :class="store.isAiAssistantOpen ? 'bg-gradient-to-tr from-brand-600 to-emerald-600 text-white shadow-xs' : 'text-slate-500'"
        >
          <Sparkles class="w-5 h-5 stroke-[2.2]" />
          <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white animate-ping"></span>
        </div>
        <span class="text-[10px] leading-none tracking-tight">კონსულტანტი</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePharmacyStore } from '../stores/pharmacyStore'
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-vue-next'

const store = usePharmacyStore()

const hasActiveOrder = computed(() => {
  return store.orders.some(o => o.status === 'გზაშია' || o.status === 'მზადდება გასატანად' || o.status === 'მზადაა ფილიალში')
})

function toggleAi() {
  store.isAiAssistantOpen = !store.isAiAssistantOpen
}
</script>
