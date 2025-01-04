import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { userApi } from "~/apis/user.api"
import { isAxiosUnprocessableEntityError, setProfileToLocalStorage } from "~/utils/auth"
import { ErrorResponse } from "~/types/utils.type"
import { UserSchemaYup, useValidationSchemas } from "~/utils/yupSchema"
import InputText from "~/components/InputText"
import DatePicker from "~/components/DatePicker/DatePicker"
import Button from "~/components/Button"
import { User } from "~/types/user.type"

type FormData = UserSchemaYup

export const EditProfileForm = ({ name, date_of_birth, bio, username, avatar, location, website }: FormData) => {
  const { t } = useTranslation()
  const { userSchemaYup } = useValidationSchemas()

  const {
    register,
    setError,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(userSchemaYup)
  })

  const updateMyProfileMutation = useMutation({
    mutationFn: (body: FormData) => userApi.updateMyProfile(body)
  })

  const onSubmit = handleSubmit((data) => {
    updateMyProfileMutation.mutate(data, {
      onSuccess: (data) => {
        reset()
        setProfileToLocalStorage(data?.data?.data as User)
        toast.success(data.data.message, { autoClose: 3000 })
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
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
    <form onSubmit={onSubmit}>
      <div className='flex flex-col justify-between items-center'>
        <InputText
          register={register}
          type='text'
          name='name'
          value={name}
          placeholder={t("name")}
          errorMessage={errors.name?.message}
          className='w-full mb-4'
        />
        <DatePicker
          className='w-full mb-4'
          name='date_of_birth'
          setValue={setValue}
          errorMessage={errors.date_of_birth?.message}
        />
        <InputText
          register={register}
          type='text'
          name='bio'
          value={bio}
          placeholder={t("bio")}
          errorMessage={errors.bio?.message}
          autoComplete='on'
          className='w-full mb-4'
        />
        <InputText
          register={register}
          type='text'
          name='location'
          value={location}
          placeholder={t("location")}
          errorMessage={errors.location?.message}
          autoComplete='on'
          className='w-full mb-4'
        />
        <InputText
          register={register}
          type='text'
          name='website'
          value={website}
          placeholder={t("website")}
          errorMessage={errors.website?.message}
          autoComplete='on'
          className='w-full mb-4'
        />
        <InputText
          register={register}
          type='text'
          name='username'
          value={username}
          placeholder={t("username")}
          errorMessage={errors.username?.message}
          autoComplete='on'
          className='w-full mb-4'
        />
        <InputText
          register={register}
          type='text'
          name='avatar'
          value={avatar}
          placeholder={t("avatar")}
          errorMessage={errors.avatar?.message}
          autoComplete='on'
          className='w-full mb-4'
        />
        <Button
          type='submit'
          isLoading={updateMyProfileMutation.isPending}
          disabled={updateMyProfileMutation.isPending}
          className='w-[100%] flex justify-center bg-gray-950 text-white text-sm p-4 rounded-xl'
        >
          {t("save")}
        </Button>
      </div>
    </form>
  )
}
