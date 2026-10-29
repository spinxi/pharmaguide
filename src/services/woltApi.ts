import type {
  DeliveryQuoteRequest,
  DeliveryQuoteResponse,
  DeliveryOrderRequest,
  DeliveryOrderResponse
} from '../types'

/**
 * Wolt Drive B2B API Integration Service
 * Simulates integration with Wolt Drive Dispatch Engine
 */
export class WoltDriveApiService {
  /**
   * Endpoint 1: Delivery Quote
   */
  static async getDeliveryQuote(_payload: DeliveryQuoteRequest): Promise<DeliveryQuoteResponse> {
    // 1.5s realistic simulation delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return {
      fee: {
        amount: 450, // 450 tetri = 4.50 GEL
        currency: 'GEL',
      },
      time_estimate_minutes: 40,
    }
  }

  /**
   * Endpoint 2: Create Delivery Order
   */
  static async createDeliveryOrder(_payload: DeliveryOrderRequest): Promise<DeliveryOrderResponse> {
    const orderUuid = 'wolt-pharma-' + Math.floor(100000 + Math.random() * 900000)

    // 1.5s realistic simulation delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return {
      wolt_order_tracking_url: `https://wolt.com/tracking/${orderUuid}`,
      status: 'created',
      order_id: orderUuid,
      tracking_code: 'WLT-' + Math.floor(1000 + Math.random() * 9000),
    }
  }
}
