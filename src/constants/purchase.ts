export const purchasesStatus = {
    inCart: -1, //sản phẩm đang trong giỏ hàng
    all: 0, //Tất cả sản phẩm
    waitForConfirmation: 1, //Sản phẩm đang đợi xác nhận từ shop
    waiForGetting: 2, // Sản phẩm đang được lấy hàng
    inProgress: 3, //Sản phẩm đang được vận chuyển
    delivered: 4, // Sản phẩm đã được giao
    cancelled: 5 //Sản phẩm đã bị hủy
} as const