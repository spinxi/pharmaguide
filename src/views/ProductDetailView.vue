<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12">
    <!-- Breadcrumbs Navigation -->
    <nav class="flex items-center gap-2 text-xs text-slate-400">
      <router-link to="/" class="hover:text-brand-600 transition-colors">მთავარი</router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
      <router-link :to="`/category/${product.categorySlug || 'medicines'}`" class="hover:text-brand-600 transition-colors">
        {{ product.category }}
      </router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
      <span class="text-slate-800 font-semibold truncate">{{ product.shortName }}</span>
    </nav>

    <!-- Main Spacious Product Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
      <!-- Left Column: High-Res Product Image with Gallery Thumbnails -->
      <div class="lg:col-span-5 space-y-4">
        <!-- Main Photo Container -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden group">
          <!-- Top Badges on Image -->
          <div class="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            <!-- Prescription badge -->
            <span
              v-if="product.classification === 'PRESCRIPTION_GROUP_2'"
              class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1.5"
            >
              <AlertTriangle class="w-3.5 h-3.5" />
              <span>II ჯგუფი (რეცეპტით)</span>
            </span>
            <span
              v-else-if="product.classification === 'OTC'"
              class="px-3 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>III ჯგუფი (ურეცეპტო)</span>
            </span>

            <!-- Discount Badge -->
            <span
              v-if="product.discountPercent"
              class="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-xs"
            >
              -{{ product.discountPercent }}%
            </span>
          </div>

          <div class="overflow-hidden rounded-2xl aspect-square flex items-center justify-center bg-slate-50/50">
            <img
              :src="currentImage"
              :alt="product.nameKa"
              @error="handleImageError"
              class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 cursor-zoom-in"
            />
          </div>
          <div class="mt-2 text-center text-[11px] text-slate-400">
            გადაატარეთ მაუსი ფოტოს გასადიდებლად
          </div>
        </div>

        <!-- Thumbnail Gallery Switcher -->
        <div v-if="productImages.length > 1" class="flex items-center gap-3">
          <button
            v-for="(img, idx) in productImages"
            :key="idx"
            @click="activeImageIndex = idx"
            class="w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer"
            :class="activeImageIndex === idx ? 'border-brand-600 shadow-xs scale-105' : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'"
          >
            <img :src="img" :alt="product.nameKa" @error="handleImageError" class="w-full h-full object-cover rounded-xl" />
          </button>
        </div>
      </div>

      <!-- Right Column: Details, Price, Actions, Promises, Specs -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Stock status & ERP sync tag -->
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>მარაგშია (სინქრონიზებულია ERP-სთან)</span>
          </span>
          <span class="text-xs text-slate-400 font-medium">
            SKU: {{ product.erpSku }}
          </span>
        </div>

        <!-- Medicine Title (Georgian + Latin Subtitle) -->
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {{ product.nameKa }}
          </h1>
          <p class="text-sm font-medium text-slate-500 mt-1">
            {{ product.nameEn }}
          </p>
        </div>

        <!-- Price, Quantity & Dynamic Add-to-Cart Action Bar -->
        <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <!-- Discounted Item: Old price with discount badge -->
            <div v-if="product.oldPrice" class="flex items-center gap-2 mb-1">
              <span class="text-sm text-slate-400 line-through font-medium">{{ product.oldPrice.toFixed(2) }} ₾</span>
              <span class="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                -{{ product.discountPercent }}%
              </span>
            </div>
            <!-- Clean Bold Price on Single Line without labels -->
            <div class="text-3xl font-black text-slate-900 tracking-tight whitespace-nowrap">
              {{ product.price.toFixed(2) }} ₾
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Quantity Selector -->
            <div class="flex items-center border border-slate-200 rounded-full bg-slate-50 p-1">
              <button
                @click="quantity = Math.max(1, quantity - 1)"
                class="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <Minus class="w-3.5 h-3.5" />
              </button>
              <span class="w-10 text-center font-bold text-sm text-slate-900">{{ quantity }}</span>
              <button
                @click="quantity++"
                class="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <Plus class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- "დამატება" Dynamic Feedback Button -->
            <button
              @click="handleAddToCart"
              class="px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
              :class="isRecentlyAdded ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'"
            >
              <Check v-if="isRecentlyAdded" class="w-4 h-4 stroke-[2.5]" />
              <ShoppingBag v-else class="w-4 h-4" />
              <span>{{ isRecentlyAdded ? 'დაემატა' : 'დამატება' }}</span>
            </button>
          </div>
        </div>

        <!-- Prescription Warning if Group II -->
        <div
          v-if="product.classification === 'PRESCRIPTION_GROUP_2'"
          class="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 space-y-1 shadow-2xs"
        >
          <div class="flex items-center gap-2">
            <ShieldAlert class="w-4 h-4 text-amber-600 shrink-0" />
            <h4 class="text-xs font-bold text-amber-900">
              გაიცემა მხოლოდ რეცეპტით ფილიალიდან
            </h4>
          </div>
          <p class="text-xs text-amber-800 leading-relaxed pl-6">
            საქართველოს კანონმდებლობით, ამ მედიკამენტის საკურიერო მიწოდება დაუშვებელია. შეგიძლიათ დაჯავშნოთ საიტიდან უფასოდ და მიიღოთ უახლოეს ფილიალში ექიმის რეცეპტის საფუძველზე.
          </p>
        </div>

        <!-- Delivery Promise Cards (Clean, Trusted Enterprise Design) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- Express Courier Card -->
          <div 
            class="p-4 rounded-2xl border transition-all flex items-start gap-3"
            :class="product.fulfillment.delivery ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'"
          >
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Truck class="w-5 h-5" />
            </div>
            <div class="space-y-0.5">
              <div class="text-xs font-bold text-slate-900">
                ექსპრეს მიწოდება (Wolt Drive)
              </div>
              <div class="text-[11px] text-slate-600 font-medium">
                {{ product.fulfillment.delivery ? 'თბილისში 40 წუთში' : 'მიწოდება შეზღუდულია (Rx)' }}
              </div>
              <div class="text-[10px] text-slate-500">
                {{ product.fulfillment.delivery ? 'კურიერული სერვისი პირდაპირ კართან' : 'კანონით მოითხოვს პირად ვიზიტს' }}
              </div>
            </div>
          </div>

          <!-- Branch Pickup Card -->
          <div class="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Store class="w-5 h-5" />
            </div>
            <div class="space-y-0.5">
              <div class="text-xs font-bold text-slate-900">
                ფილიალიდან გატანა
              </div>
              <div class="text-[11px] text-slate-600 font-medium">
                უფასო გატანა 15 წუთში
              </div>
              <div class="text-[10px] text-slate-500">
                მზადდება მყისიერად შერჩეულ ფილიალში
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Branch Availability Box (Lucide Store Button) -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <button
            @click="isBranchesOpen = !isBranchesOpen"
            class="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                <Store class="w-5 h-5" />
              </div>
              <div>
                <div class="text-xs sm:text-sm font-bold text-slate-900">
                  მარაგის შემოწმება ფილიალებში
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5">
                  დააჭირეთ ქსელის კლინიკურ ფილიალებში ხელმისაწვდომობის სანახავად
                </div>
              </div>
            </div>

            <ChevronDown
              class="w-4 h-4 text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': isBranchesOpen }"
            />
          </button>

          <!-- Branch Stock List -->
          <div
            v-if="isBranchesOpen"
            class="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-slate-100 space-y-2.5 text-xs animate-in fade-in duration-200"
          >
            <!-- 1. Lubliana Hub -->
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check class="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span class="font-bold text-slate-900">ლუბლიანას კლინიკური ჰაბი</span>
              </div>
              <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ხელმისაწვდომია
              </span>
            </div>

            <!-- 2. Vazha-Pshavela -->
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check class="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span class="font-bold text-slate-900">ვაჟა-ფშაველას ფილიალი</span>
              </div>
              <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ხელმისაწვდომია
              </span>
            </div>

            <!-- 3. Tsereteli -->
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check class="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span class="font-bold text-slate-900">წერეთლის ფილიალი</span>
              </div>
              <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ხელმისაწვდომია
              </span>
            </div>
          </div>
        </div>

        <!-- Product Specs Table -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
            პრეპარატის მახასიათებლები & სპეციფიკაცია
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-slate-400 block text-[11px]">მწარმოებელი</span>
              <span class="font-bold text-slate-800">{{ product.manufacturer }}</span>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-slate-400 block text-[11px]">ქვეყანა</span>
              <span class="font-bold text-slate-800">{{ product.country }}</span>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-slate-400 block text-[11px]">დოზირება</span>
              <span class="font-bold text-slate-800">{{ product.dosage }}</span>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-slate-400 block text-[11px]">შეფუთვა</span>
              <span class="font-bold text-slate-800">{{ product.packSize }}</span>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
              <span class="text-slate-400 block text-[11px]">აქტიური ნივთიერება</span>
              <span class="font-bold text-slate-800">{{ product.activeSubstance }}</span>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 mt-2">
              გამოყენების ინსტრუქცია & დოზირება:
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {{ product.usageKa }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products Section ("მსგავსი პროდუქტები") -->
    <div v-if="relatedProducts.length > 0" class="pt-8 border-t border-slate-200/80 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">რეკომენდაცია</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            მსგავსი პროდუქტები
          </h2>
        </div>
        <router-link
          :to="`/category/${product.categorySlug || 'medicines'}`"
          class="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
        >
          <span>მეტის ნახვა</span>
          <ChevronRight class="w-4 h-4" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="rel in relatedProducts"
          :key="rel.id"
          :product="rel"
        />
      </div>
    </div>
  </div>

  <div v-else class="max-w-md mx-auto text-center py-20">
    <h3 class="text-lg font-bold text-slate-900">პროდუქტი ვერ მოიძებნა</h3>
    <router-link to="/" class="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-full text-xs font-bold">
      მთავარზე დაბრუნება
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePharmacyStore } from '../stores/pharmacyStore'
import { handleImageError } from '../utils/imageFallback'
import ProductCard from '../components/ProductCard.vue'
import {
  ShieldAlert,
  Minus,
  Plus,
  ShoppingBag,
  ChevronDown,
  Store,
  Check,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Truck,
} from 'lucide-vue-next'

const route = useRoute()
const store = usePharmacyStore()

const quantity = ref(1)
const isBranchesOpen = ref(true)
const activeImageIndex = ref(0)

const isRecentlyAdded = ref(false)
let revertTimeout: any = null

const product = computed(() => {
  const id = route.params.id as string
  return store.products.find(p => p.id === id) || store.products[0]
})

const productImages = computed(() => {
  if (!product.value) return []
  if (product.value.images && product.value.images.length > 0) {
    return product.value.images
  }
  return [product.value.image]
})

const currentImage = computed(() => {
  if (productImages.value.length > activeImageIndex.value) {
    return productImages.value[activeImageIndex.value]
  }
  return product.value?.image || ''
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return store.products
    .filter(p => p.id !== product.value?.id && p.categorySlug === product.value?.categorySlug)
    .slice(0, 4)
})

function handleAddToCart() {
  if (product.value) {
    store.addToCart(product.value, quantity.value)
    isRecentlyAdded.value = true
    if (revertTimeout) clearTimeout(revertTimeout)
    revertTimeout = setTimeout(() => {
      isRecentlyAdded.value = false
    }, 1500)
  }
}
</script>