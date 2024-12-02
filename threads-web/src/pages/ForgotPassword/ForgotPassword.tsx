import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { authApi } from "~/apis/auth.api"
import InputText from "~/components/InputText"
import path from "~/constant/path"
import { ErrorResponse } from "~/types/utils.type"
import { isAxiosUnprocessableEntityError } from "~/utils/auth"
import { RegisterSchemaYup, useValidationSchemas } from "~/utils/yupSchema"

type FormData = Pick<RegisterSchemaYup, "email">

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { registerSchemaYup } = useValidationSchemas()
  const forgotPasswordSchema = registerSchemaYup.pick(["email"])
  // form
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema)
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: (body: FormData) => authApi.forgotPassword(body)
  })
  const onSubmit = handleSubmit((data) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: (data) => {
        reset()
        toast.success(data.data.message)
        navigate(path.posts)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            console.log("formError: ", formError)
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
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
        <span className='text-md text-stone-950 font-bold'>{t("forgotPassword")}</span>
        <div className='mt-4 w-full'>
          <InputText
            register={register}
            type='email'
            name='email'
            placeholder={t("enterEmailToResetPassword")}
            errorMessage={errors.email?.message}
          />
        </div>
        <div className='w-full'>
          <button type='submit' className='bg-gray-950 text-white text-sm p-4 rounded-xl w-full'>
            {t("sendMail")}
          </button>
        </div>
      </form>
    </div>
  )
}
