<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs transition-all">
    <!-- Top Announcement Bar -->
    <div class="bg-brand-50/80 border-b border-brand-100/50 text-slate-700 text-xs py-1.5 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <!-- Left text (Neutral terms, no Wolt splashing) -->
        <div class="flex items-center gap-2 font-medium text-[11px] sm:text-xs text-brand-900">
          <Zap class="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span>სწრაფი ექსპრეს მიწოდება თბილისში (40 წთ)</span>
          <span class="text-brand-300">|</span>
          <span class="hidden sm:inline">მიწოდება მთელ საქართველოში</span>
        </div>

        <!-- Right: Hotline & Pharmacist Terminal Link -->
        <div class="flex items-center gap-3 text-[11px] sm:text-xs shrink-0">
          <router-link
            to="/branch-terminal"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Radio class="w-3 h-3 text-brand-400 animate-pulse" />
            <span>ფარმაცევტის ტერმინალი</span>
          </router-link>

          <div class="hidden sm:flex items-center gap-1.5 text-slate-600 font-medium">
            <Phone class="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span>ცხელი ხაზი: <strong class="text-brand-900 font-mono font-bold">032 2 40 40 40</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Clean Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
      <div class="flex items-center justify-between gap-4 lg:gap-10">
        <!-- Left: Logo -->
        <router-link to="/" class="shrink-0">
          <Logo />
        </router-link>

        <!-- Center: Clean Search Bar -->
        <div class="flex-1 max-w-2xl relative hidden md:block">
          <div class="relative">
            <Search class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="მოძებნეთ სასურველი მედიკამენტი ან მოვლის საშუალება..."
              class="w-full pl-11 pr-10 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-brand-600 rounded-full focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all text-slate-900 placeholder:text-slate-400"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Search Results Dropdown -->
          <div
            v-if="searchQuery.trim().length > 0"
            class="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
          >
            <div class="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ნაპოვნია პროდუქტი
            </div>
            <div
              v-for="item in filteredProducts"
              :key="item.id"
              @click="selectSearchedProduct(item)"
              class="px-4 py-2.5 hover:bg-brand-50/50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors"
            >
              <div class="flex items-center gap-3">
                <img :src="item.image" :alt="item.nameKa" @error="handleImageError" class="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                <div>
                  <div class="text-xs font-bold text-slate-900">{{ item.shortName }}</div>
                  <div class="text-[11px] text-slate-500">{{ item.category }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs font-black text-brand-600">{{ item.price.toFixed(2) }} ₾</div>
              </div>
            </div>
            <div v-if="filteredProducts.length === 0" class="px-4 py-3 text-xs text-slate-500 text-center">
              პროდუქტი ვერ მოიძებნა
            </div>
          </div>
        </div>

        <!-- Right Side: User Account & Cart Trigger -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <!-- "ჩემი კაბინეტი" (User Icon) -->
          <router-link
            to="/account"
            class="flex items-center gap-2 px-3.5 py-2 rounded-full text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-all text-xs font-bold"
            title="ჩემი კაბინეტი"
          >
            <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <User class="w-4 h-4" />
            </div>
            <span class="hidden md:inline">ჩემი კაბინეტი</span>
          </router-link>

          <!-- "კალათა" (Cart with active price & badge) -->
          <button
            @click="store.isCartDrawerOpen = true"
            class="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            <ShoppingBag class="w-4 h-4" />
            <span class="hidden sm:inline">კალათა</span>
            <span
              v-if="store.cartItemCount > 0"
              class="w-5 h-5 rounded-full bg-white text-brand-700 font-extrabold text-[11px] flex items-center justify-center shadow-2xs"
            >
              {{ store.cartItemCount }}
            </span>
            <span v-if="store.cartItemCount > 0" class="hidden sm:inline text-brand-100 pl-1 border-l border-brand-500 font-semibold">
              {{ store.subtotal.toFixed(2) }} ₾
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div class="mt-2.5 md:hidden">
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="მოძებნეთ სასურველი მედიკამენტი ან მოვლის საშუალება..."
            class="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:bg-white text-slate-900"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePharmacyStore } from '../stores/pharmacyStore'
import { handleImageError } from '../utils/imageFallback'
import Logo from './Logo.vue'
import type { Product } from '../types'
import {
  Search,
  ShoppingBag,
  X,
  User,
  Zap,
  Phone,
  Radio,
} from 'lucide-vue-next'

const router = useRouter()
const store = usePharmacyStore()

const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase().trim()
  return store.products.filter(p =>
    p.nameKa.toLowerCase().includes(q) ||
    p.nameEn.toLowerCase().includes(q) ||
    p.activeSubstance.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  )
})

function selectSearchedProduct(product: Product) {
  router.push(`/product/${product.id}`)
  searchQuery.value = ''
}
</script>
