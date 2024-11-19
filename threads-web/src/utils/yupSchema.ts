import * as yup from "yup"
import { useTranslation } from "react-i18next"

const today = new Date()

const handleConfirmPasswordYup = (refString: string, t: (key: string) => string) => {
  return yup
    .string()
    .required(t("validation.confirmPasswordRequired"))
    .min(6, t("validation.passwordLength"))
    .max(160, t("validation.passwordLength"))
    .oneOf([yup.ref(refString)], t("validation.passwordMismatch"))
}

export const useValidationSchemas = () => {
  const { t } = useTranslation()

  const registerSchemaYup = yup.object({
    name: yup.string().required(t("validation.nameRequired")),
    email: yup
      .string()
      .required(t("validation.emailRequired"))
      .min(5, t("validation.emailLength"))
      .max(80, t("validation.emailLength")),
    password: yup
      .string()
      .required(t("validation.passwordRequired"))
      .min(6, t("validation.passwordLength"))
      .max(160, t("validation.passwordLength")),
    confirm_password: handleConfirmPasswordYup("password", t),
    date_of_birth: yup.date().required(t("validation.dateOfBirthRequired")).max(today, t("validation.dateOfBirthPast"))
  })

  const resetPasswordSchemaYup = yup.object({
    forgot_password_token: yup.string().required(t("validation.forgotPasswordTokenRequired")).nullable(),
    password: yup
      .string()
      .required(t("validation.passwordRequired"))
      .min(6, t("validation.passwordLength"))
      .max(160, t("validation.passwordLength")),
    confirm_password: handleConfirmPasswordYup("password", t)
  })

  const userSchemaYup = yup.object({
    name: yup.string().max(160, t("validation.nameMaxLength")),
    phone: yup.string().max(20, t("validation.phoneMaxLength")),
    address: yup.string().max(160, t("validation.addressMaxLength")),
    avatar: yup.string().max(1000, t("validation.avatarMaxLength")),
    date_of_birth: yup.date().max(today, t("validation.dateOfBirthPast")),
    password: registerSchemaYup.fields["password"],
    new_password: registerSchemaYup.fields["password"],
    confirm_password: handleConfirmPasswordYup("new_password", t)
  })

  return {
    registerSchemaYup,
    resetPasswordSchemaYup,
    userSchemaYup
  }
}

// Convert yup schema to data type
export type RegisterSchemaYup = yup.InferType<ReturnType<typeof useValidationSchemas>["registerSchemaYup"]>
export type UserSchemaYup = yup.InferType<ReturnType<typeof useValidationSchemas>["userSchemaYup"]>
export type ResetPasswordSchemaYup = yup.InferType<ReturnType<typeof useValidationSchemas>["resetPasswordSchemaYup"]>
