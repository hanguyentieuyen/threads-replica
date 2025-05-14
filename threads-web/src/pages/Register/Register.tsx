/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { authApi } from "~/apis/auth.api"
import { userApi } from "~/apis/user.api"
import Button from "~/components/Button"
import DatePicker from "~/components/DatePicker/DatePicker"
import InputText from "~/components/InputText"
import path from "~/constant/path"
import { ErrorResponse } from "~/types/utils.type"
import { isAxiosUnprocessableEntityError } from "~/utils/auth"
import { RegisterSchemaYup, useValidationSchemas } from "~/utils/yupSchema"

type FormData = RegisterSchemaYup
export default function Register() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { registerSchemaYup } = useValidationSchemas()
  const [currentUsername, setCurrentUsername] = useState<string>()

  const { data: checkExistUsername } = useQuery({
    queryKey: ["exist_username", currentUsername], // key currentUsername to track value change
    queryFn: () => userApi.checkExistUsername(currentUsername as string)
  })

  const handleCheckExistUsername = (v: string) => {
    setCurrentUsername(v)
  }

  const {
    register,
    setError,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchemaYup)
  })

  const registerMutation = useMutation({
    mutationFn: (body: FormData) => authApi.register(body)
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    registerMutation.mutate(data, {
      onSuccess: (data) => {
        reset()
        toast.success(data.data.message, { autoClose: 3000 })
        navigate(path.posts)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            console.log("formError: ", formError)
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData] as string,
                type: "Server"
              })
            })
          }
        }
      }
    })
  })

  useEffect(() => {
    if (checkExistUsername?.data.data?.exist) {
      setError("username", { type: "onBlur", message: "Username already exists" })
    } else {
      clearErrors("username")
    }
  }, [checkExistUsername, clearErrors, setError])

  return (
    <div className='mt-36 p-6 w-full max-w-md z-10'>
      <form onSubmit={onSubmit}>
        <div className='p-6 flex flex-col justify-between items-center'>
          <span className='text-md text-stone-950 font-bold'>{t("registerThreads")}</span>
          <div className='mt-4 w-full'>
            <InputText
              register={register}
              type='name'
              name='name'
              placeholder={t("name")}
              errorMessage={errors.name?.message}
            />
          </div>
          <div className='mt-4 w-full'>
            <InputText
              register={register}
              type='name'
              name='username'
              placeholder={t("username")}
              onBlur={(e) => handleCheckExistUsername(e.target.value)}
              errorMessage={errors.username?.message}
            />
          </div>
          <div className='mt-4 w-full'>
            <InputText
              register={register}
              type='email'
              name='email'
              placeholder={t("email")}
              errorMessage={errors.email?.message}
            />
          </div>
          <div className='w-full mt-4'>
            <InputText
              register={register}
              type='password'
              name='password'
              placeholder={t("password")}
              errorMessage={errors.password?.message}
              autoComplete='on'
            />
          </div>
          <div className='w-full mt-4'>
            <InputText
              register={register}
              type='password'
              name='confirm_password'
              placeholder={t("confirmPassword")}
              errorMessage={errors.confirm_password?.message}
              autoComplete='on'
            />
          </div>
          <div className='w-full mt-4'>
            <DatePicker name='date_of_birth' setValue={setValue} errorMessage={errors.date_of_birth?.message} />
          </div>

          <div className='w-full mt-4'>
            <Button type='submit' className='w-full flex justify-center bg-gray-950 text-white text-sm p-3 rounded-xl'>
              {t("signUp")}
            </Button>
          </div>
          <div className='mt-5 w-full flex justify-between flex-shrink-0'>
            <span className='text-sm text-gray-400'>{t("alreadyHaveAnAccount")}</span>
            <span className='text-sm text-gray-400'>
              <Link to={path.login}>{t("signIn")}</Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}
