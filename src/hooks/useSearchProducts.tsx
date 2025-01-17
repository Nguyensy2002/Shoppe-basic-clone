import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import { useForm } from 'react-hook-form'
import useQueryConfig from './useQueryConfig'
import { schema, Schema } from 'src/utils/rules'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'

//COMPONENT CHUNG CỦA THẰNG SEARCH INPUT
type FormData = Pick<Schema, 'name'>

const nameSchema = schema.pick(['name'])

export default function useSearchProducts() {
    //KHAI BÁO QUERY ĐỂ SỬ DỤNG
    const queryConfig = useQueryConfig()

    const { register, handleSubmit } = useForm<FormData>({
        defaultValues: {
        name: ''
        },
        resolver: yupResolver(nameSchema)
    })
    const navigate = useNavigate()
    //cHỨC NĂNG SUNBMIT ĐỂ TÌM KIẾM SẢN PHẨM
    const onSubmitSearch = handleSubmit((data) => {
        const config = queryConfig.order
        ? omit(
            {
                ...queryConfig,
                name: data.name
            },
            ['order', 'sort_by']
            )
        : {
            ...queryConfig,
            name: data.name
            }
        navigate({
        pathname: path.home,
        search: createSearchParams(config).toString()
        })
    })
    return { onSubmitSearch, register }
}