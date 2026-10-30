<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
    <!-- Breadcrumb & Page Heading -->
    <div class="mb-8">
      <nav class="flex items-center gap-2 text-xs text-slate-400 mb-2">
        <router-link to="/" class="hover:text-brand-600 transition-colors">მთავარი</router-link>
        <span>/</span>
        <span class="text-slate-800 font-semibold">შეკვეთის გაფორმება</span>
      </nav>
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        შეკვეთის გაფორმება
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
        აირჩიეთ მიწოდების სასურველი მეთოდი და გადახდის ფორმა
      </p>
    </div>

    <!-- Empty Cart Fallback -->
    <div v-if="store.cart.length === 0" class="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto shadow-2xs my-12">
      <div class="w-16 h-16 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-4">
        <ShoppingBag class="w-7 h-7" />
      </div>
      <h3 class="text-lg font-bold text-slate-900">თქვენი კალათა ცარიელია</h3>
      <p class="text-xs text-slate-500 mt-1 mb-6">
        გთხოვთ დაამატოთ სასურველი პროდუქტი კატალოგიდან
      </p>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-xs font-bold transition-all shadow-sm"
      >
        <span>კატალოგში დაბრუნება</span>
      </router-link>
    </div>

    <!-- 2-COLUMN CHECKOUT LAYOUT -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <!-- LEFT COLUMN: DELIVERY & PAYMENT -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Prescription Alert Banner if Group II in Cart -->
        <div
          v-if="store.hasGroupTwoPrescription"
          class="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-2xs"
        >
          <ShieldAlert class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div class="text-xs">
            <h4 class="font-bold text-amber-900">
              გაიცემა მხოლოდ რეცეპტით ფილიალიდან
            </h4>
            <p class="text-amber-800 mt-0.5 leading-relaxed">
              კალათში არის რეცეპტორული პრეპარატი <strong>({{ store.groupTwoItems.map(i => i.product.shortName).join(', ') }})</strong>.
              კანონმდებლობით საკურიერო მიწოდება გათიშულია და დაშვებულია მხოლოდ ფილიალიდან გატანა.
            </p>
          </div>
        </div>

        <!-- STEP 1: SELECT DELIVERY METHOD (3 RADIO CARDS) -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs flex items-center justify-center font-bold">1</span>
              <span>მიწოდების მეთოდი</span>
            </h3>

            <span v-if="store.hasGroupTwoPrescription" class="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              მხოლოდ ფილიალიდან გატანა
            </span>
          </div>

          <!-- 3 Radio Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- 1. ექსპრეს მიწოდება (თბილისი - 40 წთ) [4.50 ₾] -->
            <button
              type="button"
              :disabled="store.hasGroupTwoPrescription"
              @click="handleSelectFulfillment('wolt_delivery')"
              class="p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer"
              :class="[
                store.hasGroupTwoPrescription
                  ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                  : store.fulfillmentType === 'wolt_delivery'
                    ? 'border-brand-600 bg-brand-50/50 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
              ]"
            >
              <div>
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                  :class="store.fulfillmentType === 'wolt_delivery' && !store.hasGroupTwoPrescription ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'"
                >
                  <Clock class="w-4 h-4" />
                </div>
                <div class="text-xs font-bold text-slate-900">
                  ექსპრეს მიწოდება
                </div>
                <div class="text-[11px] text-slate-500 mt-0.5">
                  თბილისი (40 წთ)
                </div>
              </div>

              <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span :class="store.hasGroupTwoPrescription ? 'text-slate-400' : 'text-slate-900'">4.50 ₾</span>
                <span
                  class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                  :class="store.fulfillmentType === 'wolt_delivery' && !store.hasGroupTwoPrescription ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
                >
                  <span v-if="store.fulfillmentType === 'wolt_delivery' && !store.hasGroupTwoPrescription" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
              </div>
            </button>

            <!-- 2. მიწოდება რეგიონებში (1-2 სამუშაო დღე) [7.00 ₾] -->
            <button
              type="button"
              :disabled="store.hasGroupTwoPrescription"
              @click="handleSelectFulfillment('regional_delivery')"
              class="p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer"
              :class="[
                store.hasGroupTwoPrescription
                  ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                  : store.fulfillmentType === 'regional_delivery'
                    ? 'border-brand-600 bg-brand-50/50 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
              ]"
            >
              <div>
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                  :class="store.fulfillmentType === 'regional_delivery' && !store.hasGroupTwoPrescription ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'"
                >
                  <Truck class="w-4 h-4" />
                </div>
                <div class="text-xs font-bold text-slate-900">
                  მიწოდება რეგიონებში
                </div>
                <div class="text-[11px] text-slate-500 mt-0.5">
                  1-2 სამუშაო დღე
                </div>
              </div>

              <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span :class="store.hasGroupTwoPrescription ? 'text-slate-400' : 'text-slate-900'">7.00 ₾</span>
                <span
                  class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                  :class="store.fulfillmentType === 'regional_delivery' && !store.hasGroupTwoPrescription ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
                >
                  <span v-if="store.fulfillmentType === 'regional_delivery' && !store.hasGroupTwoPrescription" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
              </div>
            </button>

            <!-- 3. ფილიალიდან გატანა [უფასო] -->
            <button
              type="button"
              @click="handleSelectFulfillment('click_and_collect')"
              class="p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer"
              :class="[
                store.fulfillmentType === 'click_and_collect'
                  ? 'border-brand-600 bg-brand-50/50 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              ]"
            >
              <div>
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                  :class="store.fulfillmentType === 'click_and_collect' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'"
                >
                  <Store class="w-4 h-4" />
                </div>
                <div class="text-xs font-bold text-slate-900">
                  ფილიალიდან გატანა
                </div>
                <div class="text-[11px] text-slate-500 mt-0.5">
                  მზადდება 15 წუთში
                </div>
              </div>

              <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span class="text-brand-700">უფასო</span>
                <span
                  class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                  :class="store.fulfillmentType === 'click_and_collect' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
                >
                  <span v-if="store.fulfillmentType === 'click_and_collect'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
              </div>
            </button>
          </div>

          <!-- DYNAMIC ADDRESS HANDLING -->

          <!-- SCENARIO 1: ექსპრეს მიწოდება (თბილისი) — INTELLIGENT AUTO DEBOUNCE (NO MANUAL CALCULATE BUTTON) -->
          <div
            v-if="store.fulfillmentType === 'wolt_delivery' && !store.hasGroupTwoPrescription"
            class="pt-4 border-t border-slate-100 space-y-3"
          >
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1.5">
                შეიყვანეთ მიტანის მისამართი:
              </label>
              <div class="relative">
                <MapPin class="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  v-model="deliveryAddressInput"
                  @input="handleAddressAutoCalc"
                  type="text"
                  placeholder="შეიყვანეთ მიტანის მისამართი (მაგ: ი. ჭავჭავაძის 37)..."
                  class="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-600 text-slate-900 transition-all"
                />
                <Loader2 v-if="isCalculatingQuote" class="w-4 h-4 text-brand-600 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" />
              </div>
            </div>

            <!-- Quick Address Suggestions -->
            <div class="flex items-center gap-2 flex-wrap text-[11px]">
              <span class="text-slate-400 font-medium">სწრაფი არჩევა:</span>
              <button
                v-for="sample in quickAddresses"
                :key="sample"
                type="button"
                @click="selectQuickAddress(sample)"
                class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 font-medium transition-colors cursor-pointer"
              >
                {{ sample }}
              </button>
            </div>

            <!-- Auto-Calculated Quote Notice (Clean, light aesthetic) -->
            <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock class="w-3.5 h-3.5" />
                </div>
                <div>
                  <div class="font-bold text-emerald-900">
                    ექსპრეს საკურიერო მიწოდება: 4.50 ₾ | სავარაუდო დრო: ~35-40 წთ
                  </div>
                  <div class="text-[11px] text-emerald-700">
                    ავტომატურად დაემატა თქვენი შეკვეთის ჯამს
                  </div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-white text-emerald-800 text-[10px] font-bold border border-emerald-200">
                აქტიურია
              </span>
            </div>
          </div>

          <!-- SCENARIO 2: მიწოდება რეგიონებში (NO MAP, City Dropdown + Address Input, Flat 7.00 ₾) -->
          <div
            v-if="store.fulfillmentType === 'regional_delivery' && !store.hasGroupTwoPrescription"
            class="pt-4 border-t border-slate-100 space-y-3 text-xs"
          >
            <div class="flex items-center justify-between font-bold text-slate-900">
              <span class="flex items-center gap-1.5">
                <Truck class="w-4 h-4 text-brand-600" />
                რეგიონული მიწოდება საქართველოს მასშტაბით
              </span>
              <span class="text-brand-700 font-bold">ფიქსირებული ტარიფი: 7.00 ₾</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-slate-500 mb-1 font-medium">აირჩიეთ ქალაქი:</label>
                <select
                  v-model="store.regionalCity"
                  class="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-600 text-slate-900 cursor-pointer"
                >
                  <option value="ქუთაისი">ქუთაისი</option>
                  <option value="ბათუმი">ბათუმი</option>
                  <option value="რუსთავი">რუსთავი</option>
                  <option value="თელავი">თელავი</option>
                  <option value="გორი">გორი</option>
                  <option value="ზუგდიდი">ზუგდიდი</option>
                  <option value="ფოთი">ფოთი</option>
                  <option value="ახალციხე">ახალციხე</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] text-slate-500 mb-1 font-medium">მისამართი (ქუჩა, ბინა):</label>
                <input
                  v-model="store.deliveryAddress"
                  type="text"
                  placeholder="მაგ: ვაჟა-ფშაველას ქ. 15, ბინა 4"
                  class="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-600 text-slate-900"
                />
              </div>
            </div>
          </div>

          <!-- SCENARIO 3: ფილიალიდან გატანა — LIGHT-THEMED BRANCH SELECTOR -->
          <div
            v-if="store.fulfillmentType === 'click_and_collect'"
            class="pt-4 border-t border-slate-100 space-y-3 text-xs"
          >
            <div class="font-bold text-slate-900 flex items-center justify-between">
              <span>აირჩიეთ უახლოესი ფილიალი გატანისთვის:</span>
              <span class="text-brand-700 font-bold">უფასო (0.00 ₾)</span>
            </div>

            <!-- Clean, light-themed 3 branch cards -->
            <div class="space-y-2.5">
              <!-- Branch 1: Vazha-Pshavela Ave #6 (Closest) -->
              <div
                @click="store.selectedBranchId = 'vazha'"
                class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between"
                :class="store.selectedBranchId === 'vazha' ? 'border-brand-600 bg-brand-50/50 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    :class="store.selectedBranchId === 'vazha' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'"
                  >
                    <Store class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900 text-xs">ვაჟა-ფშაველას გამზ. №6</span>
                      <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        უახლოესი • 1.2 კმ
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500 mt-0.5">ღიაა 24/7 • შეკვეთის მზადყოფნა: 15 წუთი</div>
                  </div>
                </div>

                <span
                  class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                  :class="store.selectedBranchId === 'vazha' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
                >
                  <span v-if="store.selectedBranchId === 'vazha'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
              </div>

              <!-- Branch 2: Lubliana St #2/6 (Clinical Hub) -->
              <div
                @click="store.selectedBranchId = 'lubliana'"
                class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between"
                :class="store.selectedBranchId === 'lubliana' ? 'border-brand-600 bg-brand-50/50 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    :class="store.selectedBranchId === 'lubliana' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'"
                  >
                    <Store class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900 text-xs">ლუბლიანას ქ. №2/6</span>
                      <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        კლინიკური ჰაბი • 4.1 კმ
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500 mt-0.5">დიღომი, კლინიკური ცენტრი • ღიაა 24/7</div>
                  </div>
                </div>

                <span
                  class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                  :class="store.selectedBranchId === 'lubliana' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
                >
                  <span v-if="store.selectedBranchId === 'lubliana'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
              </div>

              <!-- Branch 3: Tsereteli Ave #113 -->
              <div
                @click="store.selectedBranchId = 'tsereteli'"
                class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between"
                :class="store.selectedBranchId === 'tsereteli' ? 'border-brand-600 bg-brand-50/50 shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    :class="store.selectedBranchId === 'tsereteli' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'"
                  >
                    <Store class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900 text-xs">ა. წერეთლის გამზ. №113</span>
                      <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        5.8 კმ
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500 mt-0.5">სამუშაო საათები: 09:00 - 22:00</div>
                  </div>
                </div>

                <span
                  class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                  :class="store.selectedBranchId === 'tsereteli' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
                >
                  <span v-if="store.selectedBranchId === 'tsereteli'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: PAYMENT METHODS -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs flex items-center justify-center font-bold">2</span>
            <span>გადახდის მეთოდი</span>
          </h3>

          <div class="space-y-2.5">
            <!-- 1. საბანკო ბარათი (TBC / Bank of Georgia) -->
            <label
              class="p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer"
              :class="store.paymentMethod === 'online_card' ? 'border-brand-600 bg-brand-50/40 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
            >
              <input
                type="radio"
                name="payment"
                value="online_card"
                :checked="store.paymentMethod === 'online_card'"
                @change="store.paymentMethod = 'online_card'"
                class="sr-only"
              />
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <CreditCard class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-900">საბანკო ბარათი (TBC / Bank of Georgia)</div>
                  <div class="text-[11px] text-slate-400">უსაფრთხო ონლაინ ანგარიშსწორება</div>
                </div>
              </div>
              <span
                class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                :class="store.paymentMethod === 'online_card' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
              >
                <span v-if="store.paymentMethod === 'online_card'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
            </label>

            <!-- 2. გადახდა ფილიალში გატანისას (Available only if Click & Collect is selected) -->
            <label
              class="p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer"
              :class="[
                store.fulfillmentType !== 'click_and_collect'
                  ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                  : store.paymentMethod === 'on_pickup'
                    ? 'border-brand-600 bg-brand-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
              ]"
            >
              <input
                type="radio"
                name="payment"
                value="on_pickup"
                :disabled="store.fulfillmentType !== 'click_and_collect'"
                :checked="store.paymentMethod === 'on_pickup'"
                @change="store.paymentMethod = 'on_pickup'"
                class="sr-only"
              />
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Banknote class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-900">გადახდა ფილიალში გატანისას</div>
                  <div class="text-[11px] text-slate-400">ნაღდი ანგარიშსწორება ან საბანკო ბარათი ადგილზე</div>
                </div>
              </div>
              <span
                class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                :class="store.paymentMethod === 'on_pickup' && store.fulfillmentType === 'click_and_collect' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
              >
                <span v-if="store.paymentMethod === 'on_pickup' && store.fulfillmentType === 'click_and_collect'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
            </label>
          </div>
        </div>

        <!-- Customer Contact Details -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
            საკონტაქტო მონაცემები
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block text-slate-500 mb-1">სახელი, გვარი:</label>
              <input
                v-model="store.customerName"
                type="text"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-600 text-slate-900"
              />
            </div>
            <div>
              <label class="block text-slate-500 mb-1">მობილურის ნომერი:</label>
              <input
                v-model="store.customerPhone"
                type="tel"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-600 text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: ORDER SUMMARY -->
      <div class="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6 sticky top-24">
        <div>
          <h3 class="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>შეკვეთის რეზიუმე</span>
            <span class="text-xs text-brand-600">{{ store.cartItemCount }} ერთეული</span>
          </h3>

          <div class="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
            <div
              v-for="item in store.cart"
              :key="item.product.id"
              class="py-3 flex items-center justify-between text-xs"
            >
              <div class="flex items-center gap-3">
                <img :src="item.product.image" @error="handleImageError" class="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                <div>
                  <div class="font-bold text-slate-900">{{ item.product.shortName }}</div>
                  <div class="text-slate-400 text-[11px]">{{ item.quantity }}x • {{ item.product.dosage }}</div>
                </div>
              </div>
              <span class="font-bold text-slate-900">
                {{ (item.product.price * item.quantity).toFixed(2) }} ₾
              </span>
            </div>
          </div>
        </div>

        <!-- Cost Breakdown -->
        <div class="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
          <div class="flex justify-between text-slate-500">
            <span>პროდუქტების ღირებულება:</span>
            <span class="font-bold text-slate-900">{{ store.subtotal.toFixed(2) }} ₾</span>
          </div>

          <div class="flex justify-between text-slate-500">
            <span>მიწოდების სერვისი:</span>
            <span class="font-bold" :class="store.deliveryFee > 0 ? 'text-slate-900' : 'text-brand-600'">
              {{ store.deliveryFee > 0 ? `+${store.deliveryFee.toFixed(2)} ₾` : 'უფასო (0.00 ₾)' }}
            </span>
          </div>

          <div class="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <span class="text-sm font-extrabold text-slate-900">სულ გადასახდელი:</span>
            <span class="text-2xl font-black text-brand-600">
              {{ store.total.toFixed(2) }} <span class="text-base font-bold">₾</span>
            </span>
          </div>
        </div>

        <!-- Confirm Button -->
        <div class="space-y-3">
          <button
            @click="handleConfirmOrder"
            :disabled="store.isSubmittingOrder"
            class="w-full py-4 px-6 rounded-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <Loader2 v-if="store.isSubmittingOrder" class="w-4 h-4 animate-spin" />
            <span v-if="store.isSubmittingOrder">მუშავდება...</span>
            <span v-else>შეკვეთის დადასტურება ({{ store.total.toFixed(2) }} ₾)</span>
          </button>

          <div class="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
            <ShieldCheck class="w-3.5 h-3.5 text-brand-600" />
            <span>100% ავტორიზებული სააფთიაქო ქსელი</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePharmacyStore } from '../stores/pharmacyStore'
import { handleImageError } from '../utils/imageFallback'
import type { FulfillmentType } from '../types'
import {
  ShieldAlert,
  MapPin,
  ShieldCheck,
  Loader2,
  Clock,
  Truck,
  Store,
  CreditCard,
  Banknote,
  ShoppingBag,
} from 'lucide-vue-next'

const router = useRouter()
const store = usePharmacyStore()

const deliveryAddressInput = ref(store.deliveryAddress)
const isCalculatingQuote = ref(false)
let debounceTimer: any = null

const quickAddresses = [
  'ილია ჭავჭავაძის გამზ. 37',
  'შოთა რუსთაველის გამზ. 22',
  'ალექსანდრე ყაზბეგის გამზ. 14',
]

function handleSelectFulfillment(type: FulfillmentType) {
  store.setFulfillmentType(type)
}

function handleAddressAutoCalc() {
  store.deliveryAddress = deliveryAddressInput.value
  isCalculatingQuote.value = true
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    isCalculatingQuote.value = false
  }, 800)
}

function selectQuickAddress(addr: string) {
  deliveryAddressInput.value = addr
  handleAddressAutoCalc()
}

async function handleConfirmOrder() {
  try {
    await store.submitOrder()
    router.push('/order-success')
  } catch (error) {
    store.showToast('შეცდომა', 'შეკვეთის დამუშავება ვერ მოხერხდა', 'warning')
  }
}
</script>