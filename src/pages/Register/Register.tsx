import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Input from "src/components/input";
import { getRules } from "src/utils/rules";
import {omit} from "lodash"
import { useMutation } from "@tanstack/react-query";
import  authApi  from "src/apis/auth.api";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";
import { ErrorResponse } from "src/types/utils.type";
import { useContext } from "react";
import { AppContext } from "src/contexts/app.context";
import Button from "src/components/Button";
import path from "src/constants/path";

// import { schema } from "src/utils/rules";

interface FormData {
    email: string;
    password: string;
    Confirm_password: string;
}

export default function Register(){
    const {setIsAuthenticated} = useContext(AppContext)
    //dùng navigate để chuyển sang một trang khác
    const navigate = useNavigate()
    //sử dụng hook là useForm để xử lý lỗi validate
    const {register, handleSubmit,getValues,setError, formState: {errors}} = useForm<FormData>()
    //dùng rules để validate
    const rules = getRules(getValues)
      
    const registerAccountMutation =  useMutation({
      // Omit ở đây dùng để loại trừ confirm_password
      mutationFn: (body: Omit<FormData, 'Confirm_password'>) => authApi.registerAccount(body)
  })
    const onSubmit = handleSubmit(
        (data) => {
            const body = omit(data, ['Confirm_password'])
            registerAccountMutation.mutate(body, {
                onSuccess: () => {
                    setIsAuthenticated(true)
                    navigate('/')
                },
                //hiện thị lỗi 422 trả về từ server
                onError: (error) => {
                    if(isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'Confirm_password'>>>(error)){
                        const formError = error.response?.data.data
                        //check lỗi email
                        if(formError?.email){
                            setError('email',{
                                message: formError.email,
                                type: 'Server'
                            })
                        }
                        //check lỗi password
                        if(formError?.password){
                            setError('password',{
                                message: formError.password,
                                type: 'Server'
                            })
                        }
                    }
                }
            })
        },
    )
  
    return (
        //code ui đăng ký bằng tailwindcss
        //Sử dụng register của thằng useForm để xử lý validate form input
        <div className="bg-orange">
            <div className="container ">
                <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10">
                    <div className="lg:col-span-2 lg:col-start-4">
                    <form className="p-10 rounded bg-white shadow-sm" onSubmit={onSubmit} noValidate>
                        <div className="text-2xl">Đăng Ký</div>
                        <Input name="email" placeholder="email" autoComplete="on" className="mt-8" errorMessage={errors.email?.message} type="email" register={register} rules={rules.email}/>
                        <Input name="password" placeholder="password" autoComplete="on" className="mt-2" errorMessage={errors.password?.message} type="password" register={register} rules={rules.password}/>
                        <Input name="Confirm_password" placeholder="Confirm_password" autoComplete="on" className="mt-2" errorMessage={errors.Confirm_password?.message} type="password" register={register} rules={rules.Confirm_password}/>
                        <div className="mt-3">
                            <Button className="w-full text-center py-4 px-2 uppercase bg-red-500 text-while text-sm hover:bg-red-600" isLoading={registerAccountMutation.isLoading} disabled={registerAccountMutation.isLoading}>Đăng Ký</Button>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center justify-center">
                                <span className="text-slate-400">Bạn đã có tài khoản?</span>
                                <Link className="text-red-500 ml-2" to={path.login}>Đăng nhập</Link>
                            </div>
                        </div>
                    </form>
                    </div> 
                </div>
            </div>
        </div>
    )
}