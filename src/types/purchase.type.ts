import { Product } from "./Product.type";

/** trạng thái đơn hàng
 * -1: sản phẩm đang trong giỏ hàng
 * 0: Tất cả sản phẩm
 * 1: Sản phẩm đang đợi xác nhận từ shop
 * 2: Sản phẩm đang được lấy hàng
 * 3: Sản phẩm đang được vận chuyển
 * 4: Sản phẩm đã được giao
 * 5: Sản phẩm đã bị hủy
 */

 export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5
 
 export type PurchaseListStatus = PurchaseStatus | 0
 
 export interface Purchase {
   _id: string
   buy_count: number
   price: number
   price_before_discount: number
   status: PurchaseStatus
   user: string
   product: Product
   createdAt: string
   updatedAt: string
 }
 
 export interface ExtendedPurchase extends Purchase {
   disabled: boolean
   checked: boolean
 }