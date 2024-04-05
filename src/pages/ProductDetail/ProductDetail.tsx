import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import DOMPurify from "dompurify"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ProductApi from "src/apis/Product.api"
import ProductRaiting from "src/components/ProductRaiting"
import { Product as ProductType, ProductListConfig } from "src/types/Product.type"
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from "src/utils/utils"
import Product from "../ProductList/components/Product"
import QuantityController from "src/components/QuantityController"
import purchaseApi from "src/apis/purchase.api"
import { purchasesStatus } from "src/constants/purchase"
import path from "src/constants/path"
import { useTranslation } from "react-i18next"


export default function ProductDetail () {
    const {t} = useTranslation('product')
    // dùng để set lại quantity số lượng sản phẩm 
    const [buyCount, setByCount] = useState(0)
    const {nameId} = useParams()
    const id = getIdFromNameId(nameId as string)
    // lấy dữ liệu ra từ api
    const {data: ProductDetailData} = useQuery({
        queryKey: ['product', id],
        queryFn: () => ProductApi.getProductDetails(id as string)
    })
    const product = ProductDetailData?.data.data
    const [currentIndexImages, setcurrentIndexImages] = useState([0, 5])
    const [activeImage, setActiveImage] = useState('')
    const ImageRef = useRef<HTMLImageElement>(null)
    const currentImages = useMemo(() => (product ? product.images.slice(...currentIndexImages) : []), [product, currentIndexImages])
    
    //set lại value trong input quantity khi có sự kiện tăng hoặc giảm
    const handleByCount = (value: number) => {
        setByCount(value)
    }
    //code hiển thị sản phẩm tương tự
    const queryConfig: ProductListConfig = {
        limit: '20', page: '1', category: product?.category._id,
        price_max: "",
        price_min: ""
    }
    const {data: productData} = useQuery({
        queryKey: ['product', queryConfig],
        queryFn: () => {
            return ProductApi.getProducts(queryConfig)
        },
        // khi product có data thì query mới được gọi
        enabled: Boolean(product),
        staleTime: Infinity
    })
    useEffect(() => {
        if(product && product.images.length > 0){
            setActiveImage(product.images[0])
        }
    }, [product])
    
    // dùng để next images 
    const next = () => {
        if(currentIndexImages[1] < (product as ProductType).images.length){
            setcurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
        }
    }
    //dùng để prev images 
    const prev = () => {
        if(currentIndexImages[0] > 0){
            setcurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
        }
    }
    // dùng để thực thi sự kiện di chuột vào ảnh con sẽ hiện lên trên thằng ảnh cha
    const chooseActive = (img:string) => {setActiveImage(img)}
    // dùng để di chuột vào đến đâu sẽ zoom to ảnh ở đấy
    const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const image = ImageRef.current as HTMLImageElement
        //Lấy ra kích thước chiều cao vào chiều rộng 
        const rect = event.currentTarget.getBoundingClientRect()
        // xét về kích thước mặc định của nó
        const {naturalWidth, naturalHeight} = image
        //tính lại kích thước bằng cách lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event(bubble event là khi chúng ta hover hoặc có sự kiện nào dó vào thằng con thì thằng cha cũng bị ảnh hưởng)
        const {offsetX, offsetY} = event.nativeEvent
        const top = offsetY * (1 - naturalHeight / rect.height)
        const left = offsetX * (1 - naturalWidth / rect.width)
        image.style.width = naturalWidth + 'px'
        image.style.height = naturalHeight + 'px'
        image.style.maxWidth = 'unset'
        image.style.top = top + 'px'
        image.style.left = left + 'px'
        
    }
    // khi không di vào ảnh thì sẽ trả về trạng thái ảnh mặc định
    const handleRemoveZoom = () => {
        ImageRef.current?.removeAttribute('style')
    }
    
    // code logic updated sản phẩm
    const addToCartMutation = useMutation(purchaseApi.addToCart)
    //
    const queryClient = useQueryClient()
    //Sự kiện onClick thêm sản phẩm vào giỏ hàng
    const addToCart = () => {
        addToCartMutation.mutate(
            {buy_count: buyCount, product_id: product?._id as string}
        ),
        {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
            }
        }
    }
    //điều hướng trang
    const navigate = useNavigate()
    const buyNow = async () => {
        const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
        const purchase = res.data.data
        navigate(path.cart, {
          state: {
            purchaseId: purchase._id
          }
        })
      }
    if(!product) return null
    return (
        <div className="bg-gray-200 py-6">
            <div className="container">
                <div className="bg-white p-4 shadow">
                    <div className="grid grid-cols-12 gap-9">
                        <div className="col-span-5">
                            <div className="relative w-full pt-[100%] shadow overflow-hidden" onMouseMove={handleZoom} onMouseLeave={handleRemoveZoom}>
                                <img src={activeImage} alt={product.name} ref={ImageRef} className="absolute pointer-events-none top-0 left-0 object-cover w-full h-full bg-white"/>
                            </div>
                            <div className="relative mt-4 grid grid-cols-5 gap-1">
                                <button className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white" onClick={prev}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                {/* dùng map để lấy ra các ảnh nhỏ bên dưới */}
                                {currentImages.map((img) => {
                                    const isActive = img == activeImage
                                    return (
                                        <div className="relative w-full cursor-pointer pt-[100%] shadow" key={img} onMouseEnter={() => chooseActive(img)}>
                                            <img src={img} alt={product.name} className="absolute top-0 left-0 object-cover w-full h-full bg-white"/>
                                            {isActive && <div className="absolute inset-0 border-2 border-orange"></div>}
                                        </div>
                                    )
                                })}
                                <button className="absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white" onClick={next}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="col-span-7">
                            <h1 className="text-xl font-medium uppercase">{product.name}</h1>
                            <div className="mt-8 flex items-center">
                                <div className="flex items-center">
                                    <span className="mr-1 border-b border-b-orange text-orange">{product.rating}</span>
                                    <ProductRaiting rating={product.rating} activeClassname='fill-orange text-orange h-4 w-4' nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'/>
                                </div>
                                <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                                <div className="flex">
                                    <span className="mr-1 border-b border-b-black text-black">{formatNumberToSocialStyle(product.sold)}</span>
                                    <p className="text-gray-500 text-sm ml-1">Đánh Giá</p>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
                                <div className="text-gray-500 line-through">
                                    ₫{formatCurrency(product.price_before_discount)}
                                </div>
                                <div className="ml-3 text-3xl font-medium text-orange">₫{formatCurrency(product.price)}</div>
                                <div className="ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white">
                                    {rateSale(product.price_before_discount, product.price)} giảm 
                                </div>
                            </div>
                            <div className="mt-8 flex items-center">
                                <div className="capitalize text-gray-500 mr-5">Số lượng</div>
                                    <QuantityController onDecrease={handleByCount} onIncrease={handleByCount} onType={handleByCount} value={buyCount} max={product.quantity}/>
                                <div className="ml-6 text-sm text-gray-500">{product.quantity} {t('available')}</div>
                            </div>
                            <div className="mt-8 flex items-center">
                                <button onClick={addToCart} className="flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-[10px] h-5 w-5 fill-current stroke-orange text-orange">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                    Thêm vào giỏ hàng
                                </button>
                                <button onClick={buyNow} className="flex h-12 min-w-[5rem] items-center justify-center ml-5 rounded-sm bg-orange hover:bg-orange/90 px-5 outline-none capitalize text-white shadow-sm ">
                                    Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <div className="container">
                    <div className="mt-8 bg-white p-4 shadow">
                        <div className="rounded bg-gray-50 p-4 text-lg capitalize text-slate-700">Mô tả sản phẩm</div>
                        <div className="mx-4 mt-12 mb-4 text-sm leading-loose">
                            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product.description)}}></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* render ra các sản phẩm tương tự */}
            <div className="mt-8">
                <div className="container">
                    <div className="uppercase text-gray-400">CÓ THỂ BẠN CŨNG THÍCH</div>
                    {productData && (
                        <div className="mt-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                            {/* sử dụng method mặc định trong js để render ra các item sản phẩm tương tự  */}
                                {productData.data.data.products.map((product) => (
                                    <div className="col-span-1" key={product._id}>
                                        <Product product={product}/>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}