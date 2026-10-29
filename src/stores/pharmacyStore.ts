import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Branch,
  BranchId,
  Product,
  CartItem,
  FulfillmentType,
  PaymentMethodType,
  OrderResult,
  DeliveryQuoteResponse,
  UserProfile,
  PrescriptionItem
} from '../types'
import {
  CLINICAL_BRANCHES,
  MOCK_PRODUCTS,
  MOCK_USER,
  MOCK_PRESCRIPTIONS,
  INITIAL_ORDERS
} from '../data/mockData'
import { WoltDriveApiService } from '../services/woltApi'

export const usePharmacyStore = defineStore('pharmacy', () => {
  // State
  const branches = ref<Branch[]>(CLINICAL_BRANCHES)
  const products = ref<Product[]>(MOCK_PRODUCTS)
  const user = ref<UserProfile>(MOCK_USER)
  const prescriptions = ref<PrescriptionItem[]>(MOCK_PRESCRIPTIONS)
  const orders = ref<OrderResult[]>(INITIAL_ORDERS)
  
  // Selected clinical branch (defaults to closest branch)
  const selectedBranchId = ref<BranchId>('vazha')
  
  // Cart state
  const cart = ref<CartItem[]>([])

  // UI state
  const isCartDrawerOpen = ref(false)
  const isAiAssistantOpen = ref(false)
  const stockModalProduct = ref<Product | null>(null)
  
  // Checkout Form State
  const fulfillmentType = ref<FulfillmentType>('wolt_delivery')
  const regionalCity = ref('ქუთაისი')
  const deliveryAddress = ref(MOCK_USER.defaultAddress)
  const customerName = ref(MOCK_USER.name)
  const customerPhone = ref(MOCK_USER.phone)
  const customerNotes = ref('')
  const paymentMethod = ref<PaymentMethodType>('online_card')

  // Wolt API state
  const isQuoteLoading = ref(false)
  const deliveryQuote = ref<DeliveryQuoteResponse | null>(null)
  const quoteError = ref<string | null>(null)
  const isSubmittingOrder = ref(false)
  const completedOrder = ref<OrderResult | null>(null)

  // Toast notification
  const toastMessage = ref<{ title: string; desc: string; type: 'success' | 'warning' | 'info' } | null>(null)
  let toastTimer: any = null

  function showToast(title: string, desc: string, type: 'success' | 'warning' | 'info' = 'info') {
    if (toastTimer) clearTimeout(toastTimer)
    toastMessage.value = { title, desc, type }
    toastTimer = setTimeout(() => {
      toastMessage.value = null
    }, 4000)
  }

  // Getters
  const currentBranch = computed(() => {
    return branches.value.find(b => b.id === selectedBranchId.value) || branches.value[0]
  })

  // Check if cart contains any Group II Prescription medication
  const hasGroupTwoPrescription = computed(() => {
    return cart.value.some(item => item.product.classification === 'PRESCRIPTION_GROUP_2')
  })

  const groupTwoItems = computed(() => {
    return cart.value.filter(item => item.product.classification === 'PRESCRIPTION_GROUP_2')
  })

  // Total quantity in cart
  const cartItemCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Subtotal (before delivery)
  const subtotal = computed(() => {
    return Number(cart.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2))
  })

  // Delivery fee (4.50 GEL Wolt, 7.00 GEL Regional, 0.00 GEL Click & Collect)
  const deliveryFee = computed(() => {
    if (fulfillmentType.value === 'click_and_collect') return 0
    if (fulfillmentType.value === 'regional_delivery') return 7.00
    if (hasGroupTwoPrescription.value) return 0
    return 4.50
  })

  // Grand Total
  const total = computed(() => {
    return Number((subtotal.value + deliveryFee.value).toFixed(2))
  })

  // Check if product is available across branches (ERP synced)
  function isProductAvailableInBranches(product: Product): boolean {
    const totalBranchUnits = Object.values(product.branchStock).reduce((a, b) => a + b, 0)
    return totalBranchUnits > 0
  }

  // Cart Actions
  function addToCart(product: Product, quantity = 1) {
    const existing = cart.value.find(item => item.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      cart.value.push({ product, quantity })
    }

    // Auto enforce Rule 1: If item is Group II, force pickup only
    if (product.classification === 'PRESCRIPTION_GROUP_2') {
      fulfillmentType.value = 'click_and_collect'
      showToast(
        'II ჯგუფის მედიკამენტი კალათშია',
        'კანონმდებლობით დაშვებულია მხოლოდ ფილიალიდან გატანა. კურიერული მიწოდება გაითიშა.',
        'warning'
      )
    } else {
      showToast(
        'პროდუქტი დამატებულია',
        `${product.shortName} დაემატა თქვენს კალათში.`,
        'success'
      )
    }
  }

  function removeFromCart(productId: string) {
    cart.value = cart.value.filter(item => item.product.id !== productId)
  }

  function updateQuantity(productId: string, delta: number) {
    const item = cart.value.find(i => i.product.id === productId)
    if (!item) return
    item.quantity += delta
    if (item.quantity <= 0) {
      removeFromCart(productId)
    }
  }

  function clearCart() {
    cart.value = []
  }

  // Watch / Enforce Fulfillment Rules
  function setFulfillmentType(type: FulfillmentType) {
    if (hasGroupTwoPrescription.value && type !== 'click_and_collect') {
      showToast(
        'მიწოდება შეზღუდულია!',
        'კალათში არის რეცეპტორული პრეპარატი. გაიცემა მხოლოდ ფილიალიდან.',
        'warning'
      )
      fulfillmentType.value = 'click_and_collect'
      return
    }

    fulfillmentType.value = type

    if (type !== 'click_and_collect' && paymentMethod.value === 'on_pickup') {
      paymentMethod.value = 'online_card'
    }
  }

  // Wolt Delivery Quote
  async function fetchWoltDeliveryQuote() {
    if (fulfillmentType.value !== 'wolt_delivery' || hasGroupTwoPrescription.value) return

    isQuoteLoading.value = true
    quoteError.value = null

    try {
      const pickupBranch = currentBranch.value
      const quote = await WoltDriveApiService.getDeliveryQuote({
        pickup: {
          lat: pickupBranch.lat,
          lon: pickupBranch.lon,
          address: pickupBranch.addressKa,
        },
        dropoff: {
          address: deliveryAddress.value || 'თბილისი',
        },
      })
      deliveryQuote.value = quote
    } catch (err: any) {
      quoteError.value = 'Wolt Drive სერვისთან კავშირი შეფერხდა'
    } finally {
      isQuoteLoading.value = false
    }
  }

  // Lifetime Refill Feature: re-add past order products
  function refillOrder(orderId: string) {
    const targetOrder = orders.value.find(o => o.orderId === orderId)
    if (!targetOrder) return

    targetOrder.items.forEach(orderItem => {
      addToCart(orderItem.product, orderItem.quantity)
    })

    showToast(
      'რეფილ-შეკვეთა დამატებულია',
      `შეკვეთის #${orderId} პრეპარატები წარმატებით გადმოვიდა კალათში`,
      'success'
    )
  }

  // Submit Order
  async function submitOrder(): Promise<OrderResult> {
    isSubmittingOrder.value = true

    try {
      let woltResult = null
      
      if (fulfillmentType.value === 'wolt_delivery') {
        const pickupBranch = currentBranch.value
        woltResult = await WoltDriveApiService.createDeliveryOrder({
          pickup: {
            lat: pickupBranch.lat,
            lon: pickupBranch.lon,
            address: pickupBranch.addressKa,
          },
          dropoff: {
            address: deliveryAddress.value,
          },
          customer: {
            name: customerName.value,
            phone: customerPhone.value,
          },
          contents: cart.value.map(item => ({
            description: `${item.product.shortName} (${item.product.dosage})`,
            count: item.quantity,
          })),
        })
      } else {
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      const destinationAddress = fulfillmentType.value === 'wolt_delivery'
        ? deliveryAddress.value
        : fulfillmentType.value === 'regional_delivery'
          ? `${regionalCity.value}, ${deliveryAddress.value}`
          : undefined

      const orderResult: OrderResult = {
        orderId: 'PG-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' }),
        dateStr: 'დღეს',
        items: [...cart.value],
        subtotal: subtotal.value,
        deliveryFee: deliveryFee.value,
        total: total.value,
        fulfillmentType: fulfillmentType.value,
        branch: fulfillmentType.value === 'click_and_collect' ? currentBranch.value : undefined,
        deliveryAddress: destinationAddress,
        customer: {
          name: customerName.value,
          phone: customerPhone.value,
        },
        paymentMethod: paymentMethod.value,
        woltTrackingUrl: woltResult?.wolt_order_tracking_url,
        woltStatus: woltResult?.status,
        estimatedMinutes: fulfillmentType.value === 'wolt_delivery' ? 40 : 15,
        orderStatus: 'processing',
        trackingCode: woltResult?.tracking_code,
        canRefill: true,
      }

      completedOrder.value = orderResult
      orders.value.unshift(orderResult)
      
      // Clear cart
      clearCart()
      
      return orderResult
    } finally {
      isSubmittingOrder.value = false
    }
  }

  // Quick scenarios
  function loadDemoScenario(scenario: 'otc_delivery' | 'prescription_pickup' | 'mixed_cart') {
    clearCart()
    if (scenario === 'otc_delivery') {
      addToCart(products.value[0], 1) // Detralex
      addToCart(products.value[2], 1) // Cicaplast
      fulfillmentType.value = 'wolt_delivery'
      paymentMethod.value = 'online_card'
      fetchWoltDeliveryQuote()
      showToast(
        'სცენარი 1 ჩაიტვირთა',
        'ურეცეპტო პრეპარატები და კოსმეტიკა. Wolt Drive 40-წუთიანი ექსპრეს მიწოდება აქტიურია.',
        'info'
      )
    } else if (scenario === 'prescription_pickup') {
      addToCart(products.value[1], 1) // Augmentin
      fulfillmentType.value = 'click_and_collect'
      showToast(
        'სცენარი 2 ჩაიტვირთა',
        'II ჯგუფის ანტიბიოტიკი (აუგმენტინი). კურიერული მიწოდება ავტომატურად დაიბლოკა.',
        'warning'
      )
    } else if (scenario === 'mixed_cart') {
      addToCart(products.value[0], 1)
      addToCart(products.value[1], 1)
      fulfillmentType.value = 'click_and_collect'
      showToast(
        'შერეული კალათა ჩაიტვირთა',
        'კალათში არის როგორც ურეცეპტო, ისე II ჯგუფის რეცეპტორული პრეპარატი. სავალდებულოა ფილიალიდან გატანა.',
        'warning'
      )
    }
  }

  return {
    branches,
    products,
    user,
    prescriptions,
    orders,
    selectedBranchId,
    currentBranch,
    cart,
    cartItemCount,
    subtotal,
    deliveryFee,
    total,
    hasGroupTwoPrescription,
    groupTwoItems,
    isCartDrawerOpen,
    isAiAssistantOpen,
    stockModalProduct,
    fulfillmentType,
    regionalCity,
    deliveryAddress,
    customerName,
    customerPhone,
    customerNotes,
    paymentMethod,
    isQuoteLoading,
    deliveryQuote,
    quoteError,
    isSubmittingOrder,
    completedOrder,
    toastMessage,
    showToast,
    isProductAvailableInBranches,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setFulfillmentType,
    fetchWoltDeliveryQuote,
    submitOrder,
    refillOrder,
    loadDemoScenario,
  }
})
