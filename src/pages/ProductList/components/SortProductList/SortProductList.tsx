import { sortBy,order as orderContains, order } from "src/constants/Product";
import { QueryConfig } from "src/hooks/useQueryConfig";
import classNames from "classnames";
import { ProductListConfig } from "src/types/Product.type";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import path from "src/constants/path";
import { omit } from "lodash";

interface Props{
    queryConfig: QueryConfig;
    pageSize: number;
}

export default function SortProductList({ queryConfig, pageSize}: Props) {
    // handle page mini
    const page = Number(queryConfig.page)
    const {sort_by = sortBy.createdAt,order} = queryConfig;
    // dùng useNavigate để làm sự kiện click vào là chuyển trang
    const navigate = useNavigate()
    //khai báo fct để gán sự kiện click
    const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
        navigate ({
            pathname: path.home,
            search: createSearchParams(omit({
                ...queryConfig,
                sort_by: sortByValue
            }, ['order']
            )).toString()
        })
    }
    //tạo 1 fct để gán sự kiện onchange option giá
    const handlePriceOrder = (orderValue:  Exclude<ProductListConfig['sort_by'], undefined>) => {
        navigate ({
            pathname: path.home,
            search: createSearchParams({
                ...queryConfig,
                sort_by: sortBy.price,
                order: orderValue
            }).toString()
        })
    }
    // tạo function để check active khi bấm vào
    const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
        return sort_by == sortByValue
    }
    function renderPagination(): import("react").ReactNode {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="bg-gray-300/40 py-4 px-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center flex-wrap gap-2">
                    <div className="">Sắp xếp theo</div>
                    <button className={classNames("h-8 px-4 capitalize text-center", {
                        "bg-orange text-white hover:bg-orange/80" : isActiveSortBy(sortBy.view),
                        'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
                    })}
                    onClick={() => {handleSort(sortBy.view)}}
                    >Phổ biến</button>
                    <button className={classNames("h-8 px-4 capitalize text-center", {
                        "bg-orange text-white hover:bg-orange/80" : isActiveSortBy(sortBy.createdAt),
                        'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
                    })}
                    onClick={() => {handleSort(sortBy.createdAt)}}
                    >Mới nhất</button>
                    <button className={classNames("h-8 px-4 capitalize text-center", {
                        "bg-orange text-white hover:bg-orange/80" : isActiveSortBy(sortBy.sold),
                        'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
                    })}
                    onClick={() => {handleSort(sortBy.sold)}}
                    >Bán chạy</button>
                    <select className={classNames("h-8 px-4 capitalize text-left outline-none", {
                        "bg-orange text-white hover:bg-orange/80" : isActiveSortBy(sortBy.price),
                        'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
                    })} value={order || ""} onChange={event => handlePriceOrder(event.target.value as Exclude<ProductListConfig['sort_by'], undefined>)}>
                        <option value="" disabled className="bg-white text-black">Giá</option>
                        <option value={orderContains.asc} className="bg-white text-black">Giá: Thấp đến cao</option>
                        <option value={orderContains.desc} className="bg-white text-black">Giá: Cao đến thấp</option>
                    </select>
                </div>
                <div className="flex justify-center items-center">
                    <div>
                        <span className="text-orange">{page}</span>
                        <span>/{pageSize}</span>
                    </div>
                    <div className="ml-2 flex justify-center items-center">
                        {page == 1 ? (
                            <span className="w-9 flex justify-center items-center h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </span>
                        ) : (
                        <Link to={{pathname: path.home, search: createSearchParams({...queryConfig,page:(page - 1).toString()}).toString()}} className="w-9 flex justify-center items-center h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </Link>
                        )}
                        {page == pageSize ? (
                            <span className="w-9 flex justify-center items-center h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                        ) : (
                        <Link to={{
                            pathname: path.home, search: createSearchParams({...queryConfig,page:(page + 1).toString()}).toString()
                        }}
                            className="w-9 flex justify-center items-center h-8 rounded-tr-sm rounded-br-sm bg-white hover:bg-slate-100">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}