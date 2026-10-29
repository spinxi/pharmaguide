<template>
  <div class="min-h-screen bg-surface-bg flex flex-col selection:bg-brand-100 selection:text-brand-900">
    <!-- Top & Main Navigation (Hidden on Terminal POS) -->
    <Header v-if="$route.path !== '/branch-terminal'" />

    <!-- Multi-Page Engine: Dedicated Router Views with smooth page transition -->
    <main class="flex-1 w-full pb-20 md:pb-0">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Clean Modern Footer (Hidden on Terminal POS) -->
    <footer v-if="$route.path !== '/branch-terminal'" class="bg-white text-slate-500 py-10 px-4 sm:px-6 border-t border-slate-200/80 text-xs mt-16 pb-24 md:pb-10">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <Logo />
          <span class="text-slate-300">|</span>
          <span class="text-slate-500">სანდო სააფთიაქო ქსელი</span>
        </div>

        <div class="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
          <router-link to="/" class="hover:text-brand-700 transition-colors">მთავარი</router-link>
          <router-link to="/branch-terminal" class="text-brand-700 font-bold hover:underline flex items-center gap-1">
            <span>ფარმაცევტის ტერმინალი</span>
          </router-link>
          <a href="#privacy" class="hover:text-brand-700 transition-colors">კონფიდენციალურობა</a>
          <a href="#terms" class="hover:text-brand-700 transition-colors">წესები და პირობები</a>
          <a href="#contact" class="hover:text-brand-700 transition-colors">კონტაქტი</a>
          <span>© 2026 Pharmaguide</span>
        </div>
      </div>
    </footer>

    <!-- Global Cart Drawer, AI Assistant, Mobile Bottom Nav & Toast System -->
    <CartDrawer />
    <AiAssistant v-if="$route.path !== '/branch-terminal'" />
    <MobileBottomNav v-if="$route.path !== '/branch-terminal'" />
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import CartDrawer from './components/CartDrawer.vue'
import AiAssistant from './components/AiAssistant.vue'
import MobileBottomNav from './components/MobileBottomNav.vue'
import ToastNotification from './components/ToastNotification.vue'
import Logo from './components/Logo.vue'
</script>

<style>
/* Page fade transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
