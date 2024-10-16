import * as yup from 'yup'

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}
export const registerSchemaYup = yup.object({
  email: yup.string().required('Email là bắt buộc').min(5, 'Độ dài từ 8 - 80 ký tự').max(80, 'Độ dài từ 8 - 80 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: handleConfirmPasswordYup('password')
})

export const resetPasswordSchemaYup = yup.object({
  forgot_password_token: yup.string().required('Thiếu forgot password token'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: handleConfirmPasswordYup('password')
})

export const userSchemaYup = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: registerSchemaYup.fields['password'],
  new_password: registerSchemaYup.fields['password'],
  confirm_password: handleConfirmPasswordYup('new_password')
})

// Convert yup schema to data type
export type RegisterSchemaYup = yup.InferType<typeof registerSchemaYup>
export type UserSchemaYup = yup.InferType<typeof userSchemaYup>
export type ResetPasswordSchemaYup = yup.InferType<typeof resetPasswordSchemaYup>
