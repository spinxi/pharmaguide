<template>
  <div
    v-if="store.toastMessage"
    class="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300"
  >
    <div
      class="p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md"
      :class="[
        store.toastMessage.type === 'warning'
          ? 'bg-amber-50/95 border-amber-300 text-amber-950'
          : store.toastMessage.type === 'success'
            ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
            : 'bg-white/95 border-slate-200 text-navy-900'
      ]"
    >
      <AlertTriangle v-if="store.toastMessage.type === 'warning'" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <CheckCircle2 v-else-if="store.toastMessage.type === 'success'" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
      <Info v-else class="w-5 h-5 text-clinical-600 shrink-0 mt-0.5" />

      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold leading-tight">{{ store.toastMessage.title }}</h4>
        <p class="text-[11px] mt-0.5 opacity-90 leading-relaxed">{{ store.toastMessage.desc }}</p>
      </div>

      <button
        @click="store.toastMessage = null"
        class="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePharmacyStore } from '../stores/pharmacyStore'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-vue-next'

const store = usePharmacyStore()
</script>

