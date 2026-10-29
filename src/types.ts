export type BranchId = 'lubliana' | 'vazha' | 'tsereteli'

export interface Branch {
  id: BranchId
  nameKa: string
  nameEn: string
  subtitleKa: string
  hospitalCluster: string
  addressKa: string
  addressEn: string
  phone: string
  workingHours: string
  lat: number
  lon: number
  erpSyncStatus: string
  distanceKm?: number
  distanceText?: string
}

export type ProductClassification = 'OTC' | 'PRESCRIPTION_GROUP_2' | 'COSMETICS' | 'BABY' | 'VITAMINS'

export type ProductCategorySlug = 'medicines' | 'cosmetics' | 'baby' | 'vitamins'

export interface Product {
  id: string
  nameKa: string
  nameEn: string
  shortName: string
  dosage: string
  packSize: string
  category: string
  categorySlug: ProductCategorySlug
  classification: ProductClassification
  price: number
  oldPrice?: number
  discountPercent?: number
  currency: string
  image: string
  images?: string[]
  manufacturer: string
  country: string
  barcode: string
  erpSku: string
  activeSubstance: string
  descriptionKa: string
  usageKa: string
  storageKa: string
  branchStock: Record<BranchId, number>
  fulfillment: {
    delivery: boolean
    pickup: boolean
  }
}

export interface CartItem {
  product: Product
  quantity: number
}

export type FulfillmentType = 'wolt_delivery' | 'regional_delivery' | 'click_and_collect'

export type PaymentMethodType = 'online_card' | 'on_pickup'

export interface DeliveryQuoteRequest {
  pickup: {
    lat: number
    lon: number
    address: string
  }
  dropoff: {
    address: string
  }
}

export interface DeliveryQuoteResponse {
  fee: {
    amount: number // in tetri (e.g. 450)
    currency: string
  }
  time_estimate_minutes: number
}

export interface DeliveryOrderRequest {
  pickup: {
    lat: number
    lon: number
    address: string
  }
  dropoff: {
    address: string
  }
  customer: {
    name: string
    phone: string
  }
  contents: Array<{
    description: string
    count: number
  }>
}

export interface DeliveryOrderResponse {
  wolt_order_tracking_url: string
  status: string
  order_id?: string
  tracking_code?: string
}

export interface OrderResult {
  orderId: string
  createdAt: string
  dateStr: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  fulfillmentType: FulfillmentType
  branch?: Branch
  deliveryAddress?: string
  customer: {
    name: string
    phone: string
  }
  paymentMethod: PaymentMethodType
  woltTrackingUrl?: string
  woltStatus?: string
  estimatedMinutes?: number
  orderStatus: 'courier_on_the_way' | 'preparing_for_pickup' | 'ready_for_pickup' | 'delivered' | 'processing'
  trackingCode?: string
  postalTrackingCode?: string
  pickupCode?: string
  canRefill: boolean
}

export interface PrescriptionItem {
  id: string
  code: string
  productName: string
  activeSubstance: string
  doctorName: string
  clinic: string
  issuedDate: string
  validUntil: string
  status: 'active' | 'used' | 'expired'
  dosageInstructions: string
  remainingPacks: number
}

export interface UserProfile {
  name: string
  personalId: string
  phone: string
  email: string
  defaultAddress: string
  preferredBranchId: BranchId
}
