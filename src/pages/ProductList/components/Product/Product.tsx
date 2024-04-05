import { Link } from "react-router-dom";
import ProductRaiting from "src/components/ProductRaiting";
import path from "src/constants/path";
import { Product as ProductType} from "src/types/Product.type";
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from "src/utils/utils";

interface Props {
    product: ProductType
}
// sản phẩm 
export default function Product({product}: Props) {
    return (
        <Link to={`${path.home}${generateNameId({name: product.name, id: product._id})}`}>
            <div className="bg-white shadow rounded-sm hover:translate-y-[-0.04rem] hover:shadow-md duration-150 transition-transform overflow-hidden border-orange">
                <div className="w-full pt-[100%] relative">
                    <img src={product.image} alt={product.name} className=" absolute top-0 left-0 bg-white w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden p-2">
                    <div className="min-h-[2rem] line-clamp-2 text-xs">
                        {product.name}
                    </div>
                    <div className="flex items-center mt-3">
                        <div className="line-through max-w-[50%] text-gray-500 truncate">
                            <span className="text-ms">₫</span>
                            <span>{formatCurrency(product.price_before_discount)}</span>
                        </div>
                        <div className="text-orange truncate ml-1">
                            <span className="text-ms">₫</span>
                            <span>{formatCurrency(product.price)}</span>
                        </div>
                    </div>
                    <div className="flex justify-end items-center mt-3">
                        <ProductRaiting rating={product.rating}/>
                        <div className="ml-2 text-sm">
                            <span>{formatNumberToSocialStyle(product.sold)}</span>
                            <span className="ml-1">Đã bán</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}