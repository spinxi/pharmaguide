<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
    <!-- Modern Retail Promotional Banner (Sale / Category Promo) -->
    <div class="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm border border-emerald-600/30">
      <!-- Background subtle atmospheric radial glows -->
      <div class="absolute -left-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute right-0 bottom-0 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Left Side: Content & CTA -->
      <div class="space-y-4 max-w-xl z-10 text-center md:text-left">
        <!-- Promo Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-2xs">
          <Sparkles class="w-3.5 h-3.5 text-amber-300" />
          <span>სპეციალური შეთავაზება</span>
        </div>

        <!-- Big Retail Headline -->
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
          20%-მდე ფასდაკლება დერმოკოსმეტიკაზე
        </h1>

        <!-- Subtitle -->
        <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-lg">
          La Roche-Posay, CeraVe და Vichy — პროფესიული მოვლა თქვენი კანისთვის.
        </p>

        <!-- Action CTA Button -->
        <div class="pt-2">
          <router-link
            to="/category/cosmetics"
            class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-900 font-black text-xs transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer group"
          >
            <span>პროდუქციის ნახვა</span>
            <ArrowRight class="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>
      </div>

      <!-- Right Side: Clean Visual Composition with Floating Discount Tags -->
      <div class="relative w-full max-w-sm md:max-w-md flex items-center justify-center z-10">
        <!-- Floating Discount Badge 1 -->
        <div class="absolute -top-3 left-4 z-20 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 animate-bounce">
          <Tag class="w-3.5 h-3.5 text-slate-950" />
          <span>-20% SALE</span>
        </div>

        <!-- Main Product Visual Showcase Cards -->
        <div class="relative flex items-center justify-center gap-3">
          <!-- Card 1: La Roche-Posay Skincare -->
          <div class="w-36 sm:w-44 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-white/40 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div class="aspect-square rounded-xl overflow-hidden bg-slate-50 mb-2.5 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80"
                alt="La Roche-Posay Cicaplast"
                @error="handleImageError"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="text-[11px] font-bold text-slate-900 truncate">La Roche-Posay</div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs font-black text-emerald-700">38.50 ₾</span>
              <span class="text-[10px] text-slate-400 line-through">48.10 ₾</span>
            </div>
          </div>

          <!-- Card 2: Dermo Serum / Care -->
          <div class="w-36 sm:w-44 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-white/40 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300 mt-6">
            <div class="aspect-square rounded-xl overflow-hidden bg-slate-50 mb-2.5 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80"
                alt="Dermocosmetics Care"
                @error="handleImageError"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="text-[11px] font-bold text-slate-900 truncate">Vichy Mineral 89</div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs font-black text-emerald-700">55.20 ₾</span>
              <span class="text-[10px] text-slate-400 line-through">69.00 ₾</span>
            </div>
          </div>
        </div>

        <!-- Floating Discount Badge 2 -->
        <div class="absolute -bottom-2 right-4 z-20 px-3 py-1.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-lg border border-emerald-100 flex items-center gap-1.5">
          <Sparkles class="w-3.5 h-3.5 text-amber-500" />
          <span>რჩეული ბრენდები</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { handleImageError } from '../utils/imageFallback'
import {
  Sparkles,
  ArrowRight,
  Tag,
} from 'lucide-vue-next'
</script>
