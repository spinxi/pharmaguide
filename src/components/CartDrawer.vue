<template>
  <div
    v-if="store.isCartDrawerOpen"
    class="fixed inset-0 z-50 overflow-hidden"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      @click="store.isCartDrawerOpen = false"
    ></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
        <!-- Drawer Header -->
        <div class="p-6 border-b border-slate-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                <ShoppingCart class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">თქვენი კალათა</h3>
                <p class="text-xs text-slate-400">{{ store.cartItemCount }} პროდუქტი</p>
              </div>
            </div>

            <button
              @click="store.isCartDrawerOpen = false"
              class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Prescription Warning Banner if Group II present in Cart -->
        <div
          v-if="store.hasGroupTwoPrescription"
          class="bg-amber-50/90 border-y border-amber-200 px-5 py-3 flex items-start gap-3"
        >
          <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div class="text-xs text-amber-950 leading-snug">
            <strong class="font-bold block text-amber-900">გაიცემა მხოლოდ რეცეპტით ფილიალში!</strong>
            კალათში არის II ჯგუფის მედიკამენტი. მოქმედი კანონმდებლობით მიწოდება ხორციელდება მხოლოდ ფილიალიდან გატანით.
          </div>
        </div>

        <!-- Cart Items List -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-if="store.cart.length === 0" class="text-center py-16">
            <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag class="w-7 h-7 text-slate-400" />
            </div>
            <h4 class="text-base font-bold text-slate-900">კალათა ცარიელია</h4>
            <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              დაამატეთ სასურველი მედიკამენტები ან კოსმეტიკა კატალოგიდან
            </p>
            <button
              @click="store.isCartDrawerOpen = false"
              class="mt-4 px-5 py-2.5 bg-brand-600 text-white rounded-full text-xs font-bold hover:bg-brand-700 transition-colors cursor-pointer"
            >
              კატალოგის დათვალიერება
            </button>
          </div>

          <div
            v-for="item in store.cart"
            :key="item.product.id"
            class="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all flex items-start gap-3.5"
          >
            <img
              :src="item.product.image"
              :alt="item.product.nameKa"
              @error="handleImageError"
              class="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0 bg-white"
            />

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 class="text-xs font-bold text-slate-900 leading-tight line-clamp-1">
                    {{ item.product.shortName }}
                  </h4>
                  <div class="text-[11px] text-slate-400 mt-0.5">
                    {{ item.product.dosage }}
                  </div>
                </div>

                <button
                  @click="store.removeFromCart(item.product.id)"
                  class="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                  title="წაშლა"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- Prescription warning tag per item -->
              <div v-if="item.product.classification === 'PRESCRIPTION_GROUP_2'" class="mt-1">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  <AlertTriangle class="w-2.5 h-2.5" /> II ჯგუფი • ფილიალიდან გატანა
                </span>
              </div>

              <!-- Price & Stepper -->
              <div class="flex items-center justify-between mt-3">
                <div class="text-xs font-black text-slate-900">
                  {{ (item.product.price * item.quantity).toFixed(2) }} ₾
                  <span v-if="item.quantity > 1" class="text-[10px] font-normal text-slate-400">
                    ({{ item.product.price.toFixed(2) }} ₾/ცალი)
                  </span>
                </div>

                <div class="flex items-center border border-slate-200 rounded-full bg-white">
                  <button
                    @click="store.updateQuantity(item.product.id, -1)"
                    class="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-l-full cursor-pointer"
                  >
                    <Minus class="w-3 h-3" />
                  </button>
                  <span class="w-7 text-center text-xs font-bold text-slate-900">{{ item.quantity }}</span>
                  <button
                    @click="store.updateQuantity(item.product.id, 1)"
                    class="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-r-full cursor-pointer"
                  >
                    <Plus class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Drawer Footer -->
        <div v-if="store.cart.length > 0" class="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between text-slate-500">
              <span>ღირებულება:</span>
              <span class="font-bold text-slate-900">{{ store.subtotal.toFixed(2) }} ₾</span>
            </div>
            <div class="text-[11px] text-slate-400">
              მიღების მეთოდს ირჩევთ შეკვეთის გაფორმებისას
            </div>
          </div>

          <div class="pt-2 border-t border-slate-200 flex justify-between items-baseline">
            <span class="text-sm font-bold text-slate-900">სავარაუდო ჯამი:</span>
            <span class="text-xl font-black text-brand-600">
              {{ store.subtotal.toFixed(2) }} ₾
            </span>
          </div>

          <!-- Checkout Trigger Button -->
          <button
            @click="proceedToCheckout"
            class="w-full py-3.5 px-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <span>შეკვეთის გაფორმება</span>
            <ArrowRight class="w-4 h-4" />
          </button>

          <button
            @click="store.clearCart"
            class="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            კალათის გასუფთავება
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePharmacyStore } from '../stores/pharmacyStore'
import { handleImageError } from '../utils/imageFallback'
import {
  X,
  ShoppingCart,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  AlertTriangle,
} from 'lucide-vue-next'

const router = useRouter()
const store = usePharmacyStore()

function proceedToCheckout() {
  store.isCartDrawerOpen = false
  router.push('/checkout')
}
</script>
