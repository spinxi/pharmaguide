<template>
  <div
    v-if="isOpen && order"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    @click.self="close"
  >
    <div class="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-slate-900 text-lg">#{{ order.orderId }}</span>
            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
              :class="order.orderStatus === 'courier_on_the_way' ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-700'"
            >
              {{ order.orderStatus === 'courier_on_the_way' ? 'გზაშია' : 'შესრულებული' }}
            </span>
          </div>
          <div class="text-xs text-slate-400 mt-0.5">
            შეკვეთის თარიღი: {{ order.dateStr || 'დღეს' }} {{ order.createdAt ? `(${order.createdAt})` : '' }}
          </div>
        </div>

        <button
          @click="close"
          class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
        <!-- Delivery Destination / Pickup Branch -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
          <div class="font-bold text-slate-900 flex items-center gap-2">
            <MapPin class="w-4 h-4 text-brand-600" />
            <span v-if="order.fulfillmentType === 'click_and_collect'">
              გატანის ფილიალი:
            </span>
            <span v-else>
              მიწოდების მისამართი:
            </span>
          </div>
          <p class="text-slate-700 font-medium pl-6">
            <template v-if="order.fulfillmentType === 'click_and_collect'">
              {{ order.branch?.nameKa }} ({{ order.branch?.addressKa }})
            </template>
            <template v-else>
              {{ order.deliveryAddress }}
            </template>
          </p>
        </div>

        <!-- Payment Method Used -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <CreditCard v-if="order.paymentMethod === 'online_card'" class="w-4 h-4 text-brand-600" />
            <Banknote v-else class="w-4 h-4 text-brand-600" />
            <span class="text-slate-600">გადახდის მეთოდი:</span>
          </div>
          <span class="font-bold text-slate-900">
            {{ order.paymentMethod === 'online_card' ? 'საბანკო ბარათი (TBC / Bank of Georgia)' : 'გადახდა ფილიალში (ადგილზე)' }}
          </span>
        </div>

        <!-- Products List -->
        <div class="space-y-2.5">
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
            შეძენილი პროდუქტები ({{ order.items.length }})
          </h4>

          <div class="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2 text-xs">
            <div
              v-for="item in order.items"
              :key="item.product.id"
              class="py-3 px-2 flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3">
                <img :src="item.product.image" @error="handleImageError" class="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0" />
                <div>
                  <div class="font-bold text-slate-900">{{ item.product.shortName }}</div>
                  <div class="text-slate-400 text-[11px]">{{ item.product.dosage }} • {{ item.product.manufacturer }}</div>
                </div>
              </div>

              <div class="text-right shrink-0">
                <div class="font-bold text-slate-900">
                  {{ (item.product.price * item.quantity).toFixed(2) }} ₾
                </div>
                <div class="text-[11px] text-slate-400">
                  {{ item.quantity }} × {{ item.product.price.toFixed(2) }} ₾
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Financial Summary -->
        <div class="pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div class="flex justify-between text-slate-500">
            <span>პროდუქტების ღირებულება:</span>
            <span class="font-bold text-slate-800">{{ order.subtotal.toFixed(2) }} ₾</span>
          </div>
          <div class="flex justify-between text-slate-500">
            <span>მიწოდების საფასური:</span>
            <span class="font-bold text-slate-800">
              {{ order.deliveryFee > 0 ? `${order.deliveryFee.toFixed(2)} ₾` : 'უფასო (0.00 ₾)' }}
            </span>
          </div>
          <div class="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
            <span class="text-sm text-slate-900">სულ გადახდილი:</span>
            <span class="text-xl font-black text-brand-600">{{ order.total.toFixed(2) }} ₾</span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button
          @click="close"
          class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
        >
          დახურვა
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderResult } from '../types'
import { handleImageError } from '../utils/imageFallback'
import {
  X,
  MapPin,
  CreditCard,
  Banknote,
} from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  order: OrderResult | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  emit('close')
}
</script>

