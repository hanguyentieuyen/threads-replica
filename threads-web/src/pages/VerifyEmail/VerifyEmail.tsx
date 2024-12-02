import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { authApi } from "~/apis/auth.api"
import path from "~/constant/path"
import { isAxiosUnauthorizedError, isAxiosUnprocessableEntityError } from "~/utils/auth"
import { ErrorResponse } from "~/types/utils.type"

type Token = {
  verify_email_token: string | null
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const param = searchParams.get("token")
  const navigate = useNavigate()
  console.log(param)
  const verifyEmailMutation = useMutation({
    mutationFn: (body: Token) => authApi.verifyEmail(body)
  })

  useEffect(() => {
    verifyEmailMutation.mutate(
      { verify_email_token: param },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 30 })
          navigate(path.posts)
        }
        // onError: (error) => {
        //   if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        //     const formError = error.response?.data.errors
        //     if (formError) {
        //       console.log('formError: ', formError)
        //       Object.keys(formError).forEach((key) => {
        //         console.log(key)
        //       })
        //     }
        //   }
        // }
      }
    )
  }, [])

  return (
    <div className='h-screen bg-white'>
      <div className='flex justify-center items-center h-full'>
        <img className='h-16 w-16' src='https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif' alt='' />
      </div>
    </div>
  )
}
