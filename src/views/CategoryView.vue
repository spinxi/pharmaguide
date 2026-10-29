<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex items-center text-xs text-slate-500 gap-2">
      <router-link to="/" class="hover:text-brand-600 transition-colors">მთავარი</router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-400" />
      <span class="text-slate-400">კატალოგი</span>
      <ChevronRight class="w-3.5 h-3.5 text-slate-400" />
      <span class="font-bold text-slate-800">{{ categoryTitle }}</span>
    </nav>

    <!-- Category Header Banner -->
    <div class="bg-gradient-to-r from-brand-700 to-brand-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
      <div class="relative z-10 max-w-2xl space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold text-white/90">
          <Layers class="w-3.5 h-3.5 text-brand-300" />
          <span>ავტორიზებული კატალოგი</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {{ categoryTitle }}
        </h1>
        <p class="text-xs sm:text-sm text-brand-100 max-w-xl">
          {{ categoryDescription }}
        </p>
      </div>
      <!-- Background decorative circle -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-xl"></div>
    </div>

    <!-- Category Quick Switcher Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <router-link
        v-for="cat in categoryList"
        :key="cat.slug"
        :to="`/category/${cat.slug}`"
        class="px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2"
        :class="route.params.slug === cat.slug 
          ? 'bg-brand-600 text-white shadow-xs' 
          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
      >
        <span>{{ cat.title }}</span>
        <span 
          class="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
          :class="route.params.slug === cat.slug ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'"
        >
          {{ getCategoryCount(cat.slug) }}
        </span>
      </router-link>
    </div>

    <!-- Main Content: Sidebar Filters + Products Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      <!-- Left Sidebar: Filters -->
      <aside class="lg:col-span-1 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <SlidersHorizontal class="w-4 h-4 text-brand-600" />
            <span>ფილტრები</span>
          </div>
          <button
            v-if="hasActiveFilters"
            @click="resetFilters"
            class="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
          >
            გასუფთავება
          </button>
        </div>

        <!-- Filter 1: Price Range Slider / Inputs -->
        <div class="space-y-3">
          <label class="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>ფასის შუალედი</span>
            <span class="text-[11px] font-semibold text-brand-700">{{ minPrice }} ₾ - {{ maxPrice }} ₾</span>
          </label>
          <div class="flex items-center gap-2">
            <div class="relative flex-1">
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₾</span>
              <input
                v-model.number="minPrice"
                type="number"
                min="0"
                class="w-full pl-6 pr-2 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-semibold text-slate-800"
                placeholder="მინ"
              />
            </div>
            <span class="text-slate-400 text-xs">-</span>
            <div class="relative flex-1">
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₾</span>
              <input
                v-model.number="maxPrice"
                type="number"
                min="0"
                class="w-full pl-6 pr-2 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-semibold text-slate-800"
                placeholder="მაქს"
              />
            </div>
          </div>
          <input
            v-model.number="maxPrice"
            type="range"
            min="0"
            max="120"
            step="5"
            class="w-full accent-brand-600 cursor-pointer"
          />
        </div>

        <!-- Filter 2: In Stock Only Toggle -->
        <div class="pt-4 border-t border-slate-100">
          <label class="flex items-center justify-between cursor-pointer group select-none">
            <span class="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
              მხოლოდ მარაგში არსებული
            </span>
            <input
              v-model="inStockOnly"
              type="checkbox"
              class="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 rounded-sm border-slate-300 cursor-pointer"
            />
          </label>
        </div>

        <!-- Filter 3: Discounted Items Only -->
        <div class="pt-4 border-t border-slate-100">
          <label class="flex items-center justify-between cursor-pointer group select-none">
            <span class="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
              მხოლოდ ფასდაკლებული
            </span>
            <input
              v-model="onSaleOnly"
              type="checkbox"
              class="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 rounded-sm border-slate-300 cursor-pointer"
            />
          </label>
        </div>

        <!-- Filter 4: Prescription Classification (Group II vs OTC) -->
        <div class="pt-4 border-t border-slate-100 space-y-2.5">
          <span class="text-xs font-bold text-slate-800 block">აფთიაქის კლასიფიკაცია</span>
          <div class="space-y-2">
            <label class="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                v-model="prescriptionFilter"
                type="radio"
                value="all"
                name="prescription"
                class="text-brand-600 focus:ring-brand-500"
              />
              <span>ყველა</span>
            </label>
            <label class="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                v-model="prescriptionFilter"
                type="radio"
                value="OTC"
                name="prescription"
                class="text-brand-600 focus:ring-brand-500"
              />
              <span>ურეცეპტო (OTC)</span>
            </label>
            <label class="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                v-model="prescriptionFilter"
                type="radio"
                value="PRESCRIPTION_GROUP_2"
                name="prescription"
                class="text-brand-600 focus:ring-brand-500"
              />
              <span>რეცეპტით (II ჯგუფი)</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- Right Column: Results Grid -->
      <main class="lg:col-span-3 space-y-6">
        <!-- Top Controls: Count and Sorting -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="text-xs text-slate-600 font-medium">
            სულ: <span class="font-bold text-slate-900">{{ filteredProducts.length }}</span> პროდუქტი
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-500">სორტირება:</span>
            <select
              v-model="sortBy"
              class="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="popular">პოპულარობით</option>
              <option value="price_asc">ფასი: ზრდადობით</option>
              <option value="price_desc">ფასი: კლებადობით</option>
              <option value="discount">უდიდესი ფასდაკლება</option>
            </select>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-2xs space-y-4">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <SearchX class="w-8 h-8" />
          </div>
          <h3 class="text-base font-bold text-slate-900">
            პროდუქტები ვერ მოიძებნა
          </h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            არჩეული ფილტრების შესაბამისი პროდუქტი ამ კატეგორიაში არ არსებობს. სცადეთ ფილტრების პარამეტრების შეცვლა.
          </p>
          <button
            @click="resetFilters"
            class="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            ფილტრების გასუფთავება
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePharmacyStore } from '../stores/pharmacyStore'
import ProductCard from '../components/ProductCard.vue'
import {
  ChevronRight,
  Layers,
  SlidersHorizontal,
  SearchX,
} from 'lucide-vue-next'

const route = useRoute()
const store = usePharmacyStore()

const categoryList = [
  { slug: 'medicines', title: 'მედიკამენტები', desc: 'სერტიფიცირებული მედიკამენტები და ჯანმრთელობის პროდუქტები პირდაპირ მწარმოებლებისგან.' },
  { slug: 'cosmetics', title: 'დერმოკოსმეტიკა', desc: 'კლინიკურად შემოწმებული სამედიცინო კოსმეტიკა: La Roche-Posay, CeraVe, Vichy, Bioderma.' },
  { slug: 'baby', title: 'დედა და ბავშვი', desc: 'ჩვილის მოვლის საშუალებები, ეკოლოგიური საფენები, ჰიგიენა და ორგანული საკვები.' },
  { slug: 'vitamins', title: 'ვიტამინები და იმუნიტეტი', desc: 'ვიტამინები, მინერალები და ბიოდანამატები ყოველდღიური ენერგიისა და იმუნიტეტისთვის.' },
]

const currentSlug = computed(() => (route.params.slug as string) || 'medicines')

const currentCategoryObj = computed(() => {
  return categoryList.find(c => c.slug === currentSlug.value) || categoryList[0]
})

const categoryTitle = computed(() => currentCategoryObj.value.title)
const categoryDescription = computed(() => currentCategoryObj.value.desc)

// Filters State
const minPrice = ref<number>(0)
const maxPrice = ref<number>(100)
const inStockOnly = ref<boolean>(false)
const onSaleOnly = ref<boolean>(false)
const prescriptionFilter = ref<'all' | 'OTC' | 'PRESCRIPTION_GROUP_2'>('all')
const sortBy = ref<'popular' | 'price_asc' | 'price_desc' | 'discount'>('popular')

function getCategoryCount(slug: string) {
  return store.products.filter(p => p.categorySlug === slug).length
}

const hasActiveFilters = computed(() => {
  return minPrice.value > 0 || maxPrice.value < 100 || inStockOnly.value || onSaleOnly.value || prescriptionFilter.value !== 'all'
})

function resetFilters() {
  minPrice.value = 0
  maxPrice.value = 100
  inStockOnly.value = false
  onSaleOnly.value = false
  prescriptionFilter.value = 'all'
}

const filteredProducts = computed(() => {
  let list = store.products.filter(p => {
    // Match category slug
    if (p.categorySlug && p.categorySlug !== currentSlug.value) return false
    if (!p.categorySlug && currentSlug.value !== 'medicines') return false

    // Price
    if (p.price < minPrice.value) return false
    if (p.price > maxPrice.value) return false

    // In Stock
    if (inStockOnly.value && !store.isProductAvailableInBranches(p)) return false

    // On Sale
    if (onSaleOnly.value && (!p.discountPercent || p.discountPercent <= 0)) return false

    // Prescription Filter
    if (prescriptionFilter.value !== 'all' && p.classification !== prescriptionFilter.value) {
      return false
    }

    return true
  })

  // Sort
  if (sortBy.value === 'price_asc') {
    list.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price_desc') {
    list.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'discount') {
    list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))
  }

  return list
})
</script>