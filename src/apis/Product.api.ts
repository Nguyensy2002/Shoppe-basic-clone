import { Product, ProductList, ProductListConfig } from "src/types/Product.type"
import { SuccessResponse } from "src/types/utils.type"
import http from "src/utils/http"

//khai báo api và lấy dữ liệu đổ ra trang products
const URL = 'products'
const ProductApi = {
    getProducts(params: ProductListConfig) {
        return http.get<SuccessResponse<ProductList>>(URL, {
            params
        })
    },
    getProductDetails(id: string) {
        return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
    }
}

export default ProductApi