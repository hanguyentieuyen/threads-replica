/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { authApi } from "~/apis/auth.api"
import InputText from "~/components/InputText"
import { ErrorResponse } from "~/types/utils.type"
import { isAxiosUnprocessableEntityError } from "~/utils/auth"
import { ResetPasswordSchemaYup, useValidationSchemas } from "~/utils/yupSchema"

type FormData = ResetPasswordSchemaYup

export default function ResetPassword() {
  const { t } = useTranslation()
  const { resetPasswordSchemaYup } = useValidationSchemas()
  const {
    register,
    setError,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchemaYup)
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (body: FormData) => authApi.resetPassword(body)
  })

  const onSubmit = handleSubmit((data) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: (data) => {
        reset()
        toast.success(data.data.message, { autoClose: 3000 })
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
  return (
    <div className='mt-[30vh] p-6 mb-14 w-full max-w-[400px] z-10'>
      <form onSubmit={onSubmit}>
        <span className='text-md text-stone-950 font-bold'>{t("resetPassword")}</span>
        <div className='mt-4 w-full'>
          <InputText
            register={register}
            type='password'
            name='password'
            placeholder={t("enterPassword")}
            errorMessage={errors.password?.message}
            autoComplete='on'
          />
        </div>
        <div className='w-full'>
          <InputText
            register={register}
            type='password'
            name='confirm_password'
            placeholder={t("enterConfirmPassword")}
            errorMessage={errors.confirm_password?.message}
            autoComplete='on'
          />
        </div>
        <div className='w-full'>
          <button type='submit' className='bg-gray-950 text-white text-sm p-4 rounded-xl w-full'>
            {t("resetPassword")}
          </button>
        </div>
      </form>
    </div>
  )
}
