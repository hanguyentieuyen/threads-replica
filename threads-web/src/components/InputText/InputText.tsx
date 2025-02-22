import { InputHTMLAttributes, useState } from "react"
import { RegisterOptions, UseFormRegister } from "react-hook-form"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  classNameEye?: string
}
export default function InputText({
  className,
  name,
  register,
  rules,
  errorMessage,
  classNameInput = "bg-[#f5f5f5] w-full p-3 rounded-xl outline-none",
  classNameError = "text-sm text-red-600 mt-1 min-h-[1.25rem]",
  classNameEye = "absolute right-[5px] top-[10px] h-4 w-4 cursor-pointer",
  ...rest
}: Props) {
  const [isEye, setIsEye] = useState(false)
  const toggleEye = () => {
    setIsEye((pre) => !pre)
  }
  const registerResult = register && name ? register(name, rules) : null
  const handleType = () => {
    if (rest.type === "password") {
      return isEye ? "text" : "password"
    }
    return rest.type
  }
  return (
    <div className={"relative " + className}>
      <input className={classNameInput} {...registerResult} {...rest} type={handleType()} />
      {rest.type === "password" && isEye && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className={classNameEye}
          onClick={toggleEye}
          style={{ marginRight: 8, marginTop: 8 }}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
          />
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
      )}
      {rest.type === "password" && !isEye && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className={classNameEye}
          onClick={toggleEye}
          style={{ marginRight: 8, marginTop: 8 }}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
          />
        </svg>
      )}
      {errorMessage && <div className={classNameError}>{errorMessage}</div>}
    </div>
  )
}
