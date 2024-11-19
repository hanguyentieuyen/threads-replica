import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { t } from "i18next"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { authApi } from "~/apis/auth.api"
import Button from "~/components/Button"
import InputText from "~/components/InputText"
import path from "~/constant/path"
import { ErrorResponse } from "~/types/utils.type"
import { isAxiosUnprocessableEntityError } from "~/utils/auth"
import { RegisterSchemaYup, useValidationSchemas } from "~/utils/yupSchema"

type FormData = Pick<RegisterSchemaYup, "email" | "password">

export default function Login() {
  const { registerSchemaYup } = useValidationSchemas()
  const loginSchema = registerSchemaYup.pick(["email", "password"])
  const navigate = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        reset()
        toast.success(data.data.message, { autoClose: 3000 })
        navigate(path.home)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            console.log("formError: ", formError)
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof Omit<FormData, "confirm_password">],
                type: "Server"
              })
            })
          }
        }
      }
    })
  })
  return (
    <div className='mt-[30vh] p-6 mb-14 w-full max-w-[400px] z-10'>
      <form onSubmit={onSubmit}>
        <div className='p-6 flex flex-col justify-between items-center'>
          <span className='text-md text-stone-950 font-bold'>{t("loginThreads")}</span>
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
            <Button
              type='submit'
              isLoading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              className='w-[100%] flex justify-center bg-gray-950 text-white text-sm p-4 rounded-xl'
            >
              {t("signIn")}
            </Button>
          </div>
          <div className='mt-5 w-full flex justify-between flex-shrink-0'>
            <span className='text-sm text-gray-400'>
              <Link to={path.forgotPassword}>{t("forgotPassword")}?</Link>
            </span>
            <span className='text-sm text-gray-400'>
              <Link to={path.register}>{t("signUp")}</Link>
            </span>
          </div>
          <hr className='w-full mt-8'></hr>
        </div>
      </form>
    </div>
  )
}
