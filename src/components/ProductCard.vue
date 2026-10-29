<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
    <!-- Image & Classification Header -->
    <div
      class="relative bg-slate-50/60 p-6 aspect-[4/3] flex items-center justify-center overflow-hidden cursor-pointer"
      @click="goToProduct"
    >
      <!-- Top Badges -->
      <div class="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10 pointer-events-none">
        <!-- Classification -->
        <span
          v-if="product.classification === 'PRESCRIPTION_GROUP_2'"
          class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1 border border-amber-600 pointer-events-auto"
        >
          <AlertTriangle class="w-3 h-3" />
          <span>II ჯგუფი (რეცეპტით)</span>
        </span>
        <span
          v-else-if="product.classification === 'OTC'"
          class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-600 text-white shadow-xs flex items-center gap-1 pointer-events-auto"
        >
          <CheckCircle2 class="w-3 h-3" />
          <span>III ჯგუფი (ურეცეპტო)</span>
        </span>
        <span
          v-else-if="product.classification === 'COSMETICS'"
          class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-700 text-white shadow-xs flex items-center gap-1 pointer-events-auto"
        >
          <Sparkles class="w-3 h-3" />
          <span>დერმოკოსმეტიკა</span>
        </span>
        <span
          v-else-if="product.classification === 'BABY'"
          class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-600 text-white shadow-xs flex items-center gap-1 pointer-events-auto"
        >
          <Baby class="w-3 h-3" />
          <span>დედა & ბავშვი</span>
        </span>
        <span
          v-else-if="product.classification === 'VITAMINS'"
          class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1 pointer-events-auto"
        >
          <ShieldPlus class="w-3 h-3" />
          <span>ვიტამინები</span>
        </span>
        <span
          v-else
          class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-700 text-white shadow-xs flex items-center gap-1 pointer-events-auto"
        >
          <span>მოვლა</span>
        </span>
      </div>

      <!-- Product Image -->
      <img
        :src="product.image"
        :alt="product.nameKa"
        @error="handleImageError"
        class="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Quick View Hover Overlay -->
      <div
        class="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5"
      >
        <div class="px-3.5 py-1.5 bg-white/95 text-slate-900 rounded-full shadow-md text-xs font-bold flex items-center gap-1.5">
          <Eye class="w-3.5 h-3.5 text-brand-600" />
          <span>დათვალიერება</span>
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div>
        <!-- Category & Stock Status (SVG dot + "მარაგშია") -->
        <div class="flex items-center justify-between text-xs mb-1.5">
          <span class="font-medium text-slate-400">{{ product.category }}</span>

          <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>მარაგშია</span>
          </span>
        </div>

        <!-- Product Name (Click to PDP) -->
        <h3
          @click="goToProduct"
          class="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
        >
          {{ product.nameKa }}
        </h3>
        
        <p class="text-xs text-slate-500 mt-1 line-clamp-1">
          {{ product.manufacturer }} • {{ product.dosage }}
        </p>

        <!-- Fulfillment Distinction Tag with Lucide Bike or AlertCircle -->
        <div class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
          <!-- Delivery eligible -->
          <template v-if="product.fulfillment.delivery">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <Clock class="w-3.5 h-3.5 text-emerald-600" />
              <span>ექსპრეს მიწოდება</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-200">
              <Store class="w-3.5 h-3.5 text-slate-500" />
              <span>ფილიალიდან გატანა</span>
            </span>
          </template>

          <!-- Group II Prescription Warning Badge -->
          <template v-else>
            <div class="w-full bg-amber-50 border border-amber-300 rounded-xl p-2 flex items-center gap-2">
              <AlertCircle class="w-4 h-4 text-amber-600 shrink-0" />
              <div class="text-[11px] font-bold text-amber-900 leading-tight">
                მხოლოდ ფილიალიდან გატანა
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Price & Prominent Add to Cart Button -->
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div class="min-w-0 flex flex-col justify-end">
          <!-- Discounted Item: Struck-through old price next to red discount badge -->
          <div v-if="product.oldPrice" class="flex items-center gap-1.5 mb-0.5">
            <span class="text-xs text-slate-400 line-through font-medium whitespace-nowrap">
              {{ product.oldPrice.toFixed(2) }} ₾
            </span>
            <span
              v-if="product.discountPercent"
              class="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 shrink-0"
            >
              -{{ product.discountPercent }}%
            </span>
          </div>

          <!-- Final Bold Price on Single Line -->
          <div class="text-base sm:text-lg font-black text-slate-900 whitespace-nowrap tracking-tight">
            {{ product.price.toFixed(2) }} ₾
          </div>
        </div>

        <button
          @click="addToCart"
          class="shrink-0 px-3.5 sm:px-4 py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
          :class="isRecentlyAdded ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'"
        >
          <Check v-if="isRecentlyAdded" class="w-3.5 h-3.5 stroke-[2.5]" />
          <ShoppingBag v-else class="w-3.5 h-3.5" />
          <span>{{ isRecentlyAdded ? 'დაემატა' : 'დამატება' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePharmacyStore } from '../stores/pharmacyStore'
import { handleImageError } from '../utils/imageFallback'
import type { Product } from '../types'
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  ShoppingBag,
  Check,
  Bike,
  Store,
  Baby,
  ShieldPlus,
  Clock,
} from 'lucide-vue-next'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const store = usePharmacyStore()

const isRecentlyAdded = ref(false)
let revertTimeout: any = null

function goToProduct() {
  router.push(`/product/${props.product.id}`)
}

function addToCart() {
  store.addToCart(props.product, 1)
  isRecentlyAdded.value = true
  if (revertTimeout) clearTimeout(revertTimeout)
  revertTimeout = setTimeout(() => {
    isRecentlyAdded.value = false
  }, 1500)
}
</script>
