import path from "src/constants/path";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import Button from "src/components/Button";
import { Category } from "src/types/category.type";
import classNames from "classnames";
import InputNumber from "src/components/inputNumber";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Schema, schema } from 'src/utils/rules'
import { ObjectSchema } from "yup";
import { NoUndefinedField } from "src/types/utils.type";
import RaitingStart from "../RaitingStar";
import {omit} from 'lodash'
import { QueryConfig } from "src/hooks/useQueryConfig";
import {useTranslation} from 'react-i18next'

interface Props {
    queryConfig: QueryConfig
    categories: Category[]
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>
const priceSchema = schema.pick(['price_min', 'price_max'])

// menu bar
export default function({queryConfig, categories}: Props){
    // lấy t được sử dụng qua thằng hook để thay đổi ngôn ngữ thông qua thư viện i18next
    const {t} = useTranslation(['home'])
    const {category} = queryConfig;
    const {control, handleSubmit, trigger, reset, watch, formState:{errors}} = useForm<FormData>({
        defaultValues: {
            price_min: '',
            price_max: '',
        },
        resolver: yupResolver<FormData>(priceSchema as ObjectSchema<FormData>),
        shouldFocusError: false,
    })
    //chức năng tìm kiếm theo giá 
    // sử dụng navigate
    const navigate = useNavigate()
    const valueForm = watch()
    
    // lấy data từ queryConfig trong api đổ ra thông qua thằng navigate thực hiện submit tìm kiếm theo khoảng giá
    const onSubmit = handleSubmit((data) => {
        navigate({
            pathname: path.home,
            search: createSearchParams({
                ...queryConfig,
                price_max: data.price_max,
                price_min: data.price_min
            }).toString()
        })
    })
    // tạo method handle xóa tất cả bằng cách dùng thư viện omit trong lodash để loại bỏ những cái cần remove
    const handleRemoveAll = () => {
        reset()
        navigate({
            pathname: path.home,
            search: createSearchParams(omit(queryConfig, ['price_max', 'price_min', 'rating_filter', 'category']
            )).toString()
        })
    }
        
    return (
        <div className="py-4">
            <Link to={path.home} className={classNames("flex items-center font-bold", {
                'text-orange': !category
            })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-4 mr-3 fill-current">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
            {t('asideFilter.all categories')}
            </Link>
            <div className="bg-gray-300 h-[1px] my-4" />
            <ul>
                {categories.map((categoryItem) => {
                    // hàm check 
                    const isActive = category == categoryItem._id
                    return (
                    <li className="py-2 pl-2" key={categoryItem._id}>
                        <Link to={{pathname: path.home, search: createSearchParams({...queryConfig, category:categoryItem._id}).toString()}} className={classNames("relative px-2", {
                            'font-semibold text-orange' :  isActive
                        })}>
                            {/* check hiện icon */}
                            {isActive && ( <svg viewBox="0 0 4 7" className="fill-orange h-2 w-2 absolute top-1 left-[-10px]">
                                <polygon points="4 3.5 0 0 0 7" />
                            </svg>)}
                            {categoryItem.name}
                        </Link>
                    </li>
                )})}
            </ul>
                <Link to={path.home} className="flex items-center font-bold mt-4 uppercase">
                    <svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x={0} y={0} className="w-3 h-4 stroke-current mr-3"><g><polyline fill="current" points="5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2"/></g>
                    </svg>
                    {t('asideFilter.filter search')}
                </Link>
                <div className="bg-gray-300 h-[1px] my-4" />
                <div className="my-5">
                    <div className="py-2">Khoảng giá</div>
                    <form className="mt-2" onSubmit={onSubmit}>
                        <div className="flex items-start">
                            <Controller 
                                control={control}
                                name="price_min"
                                render={({field}) => {
                                    return (
                                        <InputNumber ref={field.ref} onChange={(event) => {field.onChange(event), trigger("price_max")}} value={field.value} classNameError="hidden" type="text" className="grow" placeholder="₫ TỪ" classNameInput="p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm">
                                        </InputNumber>
                                    )
                                }}
                            />
                            <div className="mx-2 mt-2 shrink-0">-</div>
                            <Controller 
                                control={control}
                                name="price_max"
                                render={({field}) => {
                                    return (
                                        <InputNumber ref={field.ref} onChange={event => {field.onChange(event), trigger("price_min")}} value={field.value} classNameError="hidden" type="text" className="grow" placeholder="₫ ĐẾN" classNameInput="p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm">
                                        </InputNumber>
                                    )
                                }}
                            />
                        </div>
                        <div className="mt-1 text-red-600 text-sm min-h-[1.25rem] text-center">{errors.price_min?.message}</div>
                        <Button className="w-full py-2 px-2 uppercase bg-orange text-white text-sm hover:bg-orange/80 flex justify-center items-center">Áp Dụng</Button>
                    </form>
                </div>
                <div className="bg-gray-300 h-[1px] my-4" />
                <div className="text-sm">Đánh giá</div>
                <RaitingStart queryConfig={queryConfig}/>
                <div className="bg-gray-300 h-[1px] my-4" />
                <Button onClick={handleRemoveAll} className="w-full py-2 px-2 uppercase bg-orange text-sm hover:bg-orange/80 text-white">Xóa tất cả</Button>   
        </div>
    )
}