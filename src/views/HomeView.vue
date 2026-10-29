<template>
  <div class="space-y-8">
    <!-- Compact Promotional Hero Banner -->
    <HeroBanner />

    <!-- Category Circles Bar (Horizontal Quick Navigation) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 w-full">
      <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
            სწრაფი ნავიგაცია კატეგორიებით
          </h3>
          <router-link to="/category/medicines" class="text-xs text-brand-700 font-semibold hover:underline">
            ყველა კატეგორია
          </router-link>
        </div>

        <!-- Category Buttons -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <!-- 1. Pill მედიკამენტები -->
          <router-link
            to="/category/medicines"
            class="flex flex-col items-center text-center p-3.5 rounded-2xl transition-all cursor-pointer group hover:bg-slate-50 border border-transparent hover:border-slate-100"
          >
            <div class="w-12 h-12 rounded-2xl bg-brand-50 group-hover:bg-brand-100/80 text-brand-700 flex items-center justify-center transition-transform group-hover:scale-105 mb-2 shadow-2xs border border-brand-100">
              <Pill class="w-6 h-6" />
            </div>
            <span class="text-xs font-bold text-slate-800 group-hover:text-brand-700 leading-tight">
              მედიკამენტები
            </span>
            <span class="text-[10px] text-slate-400 mt-0.5">6 პროდუქტი</span>
          </router-link>

          <!-- 2. Sparkles დერმოკოსმეტიკა -->
          <router-link
            to="/category/cosmetics"
            class="flex flex-col items-center text-center p-3.5 rounded-2xl transition-all cursor-pointer group hover:bg-slate-50 border border-transparent hover:border-slate-100"
          >
            <div class="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-transform group-hover:scale-105 mb-2 shadow-2xs border border-purple-100">
              <Sparkles class="w-6 h-6" />
            </div>
            <span class="text-xs font-bold text-slate-800 group-hover:text-purple-700 leading-tight">
              დერმოკოსმეტიკა
            </span>
            <span class="text-[10px] text-slate-400 mt-0.5">6 პროდუქტი</span>
          </router-link>

          <!-- 3. Baby დედა და ბავშვი -->
          <router-link
            to="/category/baby"
            class="flex flex-col items-center text-center p-3.5 rounded-2xl transition-all cursor-pointer group hover:bg-slate-50 border border-transparent hover:border-slate-100"
          >
            <div class="w-12 h-12 rounded-2xl bg-pink-50 group-hover:bg-pink-100 text-pink-700 flex items-center justify-center transition-transform group-hover:scale-105 mb-2 shadow-2xs border border-pink-100">
              <Baby class="w-6 h-6" />
            </div>
            <span class="text-xs font-bold text-slate-800 group-hover:text-pink-700 leading-tight">
              დედა და ბავშვი
            </span>
            <span class="text-[10px] text-slate-400 mt-0.5">6 პროდუქტი</span>
          </router-link>

          <!-- 4. ShieldPlus ვიტამინები და იმუნიტეტი -->
          <router-link
            to="/category/vitamins"
            class="flex flex-col items-center text-center p-3.5 rounded-2xl transition-all cursor-pointer group hover:bg-slate-50 border border-transparent hover:border-slate-100"
          >
            <div class="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-transform group-hover:scale-105 mb-2 shadow-2xs border border-amber-100">
              <ShieldPlus class="w-6 h-6" />
            </div>
            <span class="text-xs font-bold text-slate-800 group-hover:text-amber-700 leading-tight">
              ვიტამინები & იმუნიტეტი
            </span>
            <span class="text-[10px] text-slate-400 mt-0.5">6 პროდუქტი</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- MULTI-ROW GRID CATALOG (Commercial Storefront Structure) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-12 pb-16">
      <!-- ROW 1: "პოპულარული მედიკამენტები" -->
      <div class="space-y-5">
        <div class="flex items-end justify-between border-b border-slate-200/80 pb-3">
          <div>
            <div class="flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-0.5">
              <span class="w-2 h-2 rounded-full bg-brand-600"></span>
              სანდო სააფთიაქო ქსელი
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              პოპულარული მედიკამენტები
            </h2>
          </div>
          <router-link
            to="/category/medicines"
            class="text-xs text-brand-700 hover:text-brand-800 font-bold flex items-center gap-1 group"
          >
            <span>სრულად ნახვა</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <ProductCard
            v-for="product in rowMedicines"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>

      <!-- MIDDLE IN-BETWEEN BANNER: "მშობელთა კლუბი" -->
      <div class="bg-gradient-to-r from-amber-50 via-emerald-50/50 to-teal-50 border border-amber-200/60 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs relative overflow-hidden">
        <div class="space-y-3 max-w-xl z-10 text-center md:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-bold">
            <Baby class="w-3.5 h-3.5 text-amber-700" />
            <span>მშობელთა კლუბი</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            ყველაფერი პატარებისთვის — საფენები, ჩვილის მოვლა და ჯანსაღი კვება წამყვანი ევროპული ბრენდებისგან.
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            შეიძინეთ ავტორიზებული ჰიპოალერგიული პროდუქტები ოფიციალური გარანტიით.
          </p>
        </div>

        <div class="shrink-0 z-10">
          <router-link
            to="/category/baby"
            class="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/20 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <span>კატალოგის ნახვა</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>

        <!-- Subtle backdrop illustration effect -->
        <div class="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-amber-200/20 blur-2xl pointer-events-none"></div>
      </div>

      <!-- ROW 2: "დედა და ბავშვი" -->
      <div class="space-y-5">
        <div class="flex items-end justify-between border-b border-slate-200/80 pb-3">
          <div>
            <div class="flex items-center gap-1.5 text-xs font-bold text-pink-600 uppercase tracking-wider mb-0.5">
              <span class="w-2 h-2 rounded-full bg-pink-600"></span>
              ჩვილისა და დედის მოვლა
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              დედა და ბავშვი
            </h2>
          </div>
          <router-link
            to="/category/baby"
            class="text-xs text-brand-700 hover:text-brand-800 font-bold flex items-center gap-1 group"
          >
            <span>სრულად ნახვა</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <ProductCard
            v-for="product in rowBaby"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>

      <!-- ROW 3: "დერმოკოსმეტიკა" -->
      <div class="space-y-5">
        <div class="flex items-end justify-between border-b border-slate-200/80 pb-3">
          <div>
            <div class="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-0.5">
              <span class="w-2 h-2 rounded-full bg-purple-600"></span>
              სამედიცინო მოვლა
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              დერმოკოსმეტიკა
            </h2>
          </div>
          <router-link
            to="/category/cosmetics"
            class="text-xs text-brand-700 hover:text-brand-800 font-bold flex items-center gap-1 group"
          >
            <span>სრულად ნახვა</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <ProductCard
            v-for="product in rowCosmetics"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePharmacyStore } from '../stores/pharmacyStore'
import HeroBanner from '../components/HeroBanner.vue'
import ProductCard from '../components/ProductCard.vue'
import {
  Pill,
  Sparkles,
  Baby,
  ShieldPlus,
  ArrowRight,
} from 'lucide-vue-next'

const store = usePharmacyStore()

// Row 1: Medicines (Detralex, Augmentin, Nurofen)
const rowMedicines = computed(() => {
  return store.products.filter(p => p.categorySlug === 'medicines').slice(0, 3)
})

// Row 2: Baby (Canbebe, HiPP, Sudocrem)
const rowBaby = computed(() => {
  return store.products.filter(p => p.categorySlug === 'baby').slice(0, 3)
})

// Row 3: Cosmetics (Cicaplast, CeraVe, Vichy)
const rowCosmetics = computed(() => {
  return store.products.filter(p => p.categorySlug === 'cosmetics').slice(0, 3)
})
</script>