import { RegisterOptions, UseFormGetValues } from "react-hook-form"
import * as yup from 'yup'
type Rules = {[key in 'email' | 'password' | 'Confirm_password']?: RegisterOptions}
// khai báo 1 rules để sử dụng cho validate input
export const  getRules = (getValues?:UseFormGetValues<any>):Rules => ({
    email: {
        required: {
            value: true,
            message: 'Email là bắt buộc'
        },
        pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Email không đúng định dạng"
        },
        maxLength: {
            value: 160, 
            message: 'Độ dài từ 5-160 ký tự'
        },
        minLength: {
            value: 5, 
            message: 'Độ dài từ 5-160 ký tự'
        }
    },
    password: {
        required: {
            value: true,
            message: 'Vui lòng nhập mật khẩu'
        },
        pattern: {
            value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            message: 'Mật khẩu không đúng định dạng'
        },
        maxLength: {
            value: 160, 
            message: 'Độ dài từ 6-160 ký tự'
        },
        minLength: {
            value: 6, 
            message: 'Độ dài từ 6-160 ký tự'
        }
    },
    Confirm_password: {
        required:{
            value: true,
            message: 'Vui lòng nhập lại mật khẩu'
        },
        maxLength: {
            value: 160, 
            message: 'Độ dài từ 6-160 ký tự'
        },
        minLength: {
            value: 6, 
            message: 'Độ dài từ 6-160 ký tự'
        },
        //kiểm tra nhập lại mật khẩu có khớp hay không
        validate: typeof getValues === 'function' ? (value) => value === getValues('password') || 'Mật khẩu nhập lại không khớp' : undefined
    }
})

// check điều kiện tìm kiếm theo giá
function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
    const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
    if (price_min !== '' && price_max !== '') {
      return Number(price_max) >= Number(price_min)
    }
    return price_min !== '' || price_max !== ''
}

// sử dụng schema để check tìm kiếm nếu lỗi sẽ hiển thị ra message lỗi
const handleConfirmPasswordYup = (refString: string) => {
    return yup
      .string()
      .required('Nhập lại password là bắt buộc')
      .min(6, 'Độ dài từ 6 - 160 ký tự')
      .max(160, 'Độ dài từ 6 - 160 ký tự')
      .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
  }
export const schema = yup.object({
    email: yup
      .string()
      .required('Email là bắt buộc')
      .email('Email không đúng định dạng')
      .min(5, 'Độ dài từ 5 - 160 ký tự')
      .max(160, 'Độ dài từ 5 - 160 ký tự'),
    password: yup
      .string()
      .required('Password là bắt buộc')
      .min(6, 'Độ dài từ 6 - 160 ký tự')
      .max(160, 'Độ dài từ 6 - 160 ký tự'),
    confirm_password: handleConfirmPasswordYup('password'),
    price_min: yup.string().test({
      name: 'price-not-allowed',
      message: 'Giá không phù hợp',
      test: testPriceMinMax
    }),
    price_max: yup.string().test({
      name: 'price-not-allowed',
      message: 'Giá không phù hợp',
      test: testPriceMinMax
    }),
    name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
  })
export type Schema = yup.InferType<typeof schema>

// //Schema validation với Yub 
// export const schema = yup.object({
//     email: yup
//     .string()
//     .required('Email là bắt buộc')
//     .email('Email không đúng định dạng')
//     .min(5, 'Độ dài từ 5 - 160 ký tự')
//     .max(160, 'Độ dài tử 5 - 160 ký tự')
// })

//KHAI BÁO CÁC TRƯỜNG DỮ LIỆU SỬ DỤNG TRONG USER
export const userSchema = yup.object({
    name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
    phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
    address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
    avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
    date_of_birth: yup.date().max(new Date(),'Hãy chọn một ngày trong quá khứ'),
    password: schema.fields['password'],
    new_password: schema.fields['password'],
    confirm_password: handleConfirmPasswordYup('new_password')
})
export type UserSchema = yup.InferType<typeof userSchema>
