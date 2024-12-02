import ContentContainer from "~/components/ContentContainer"
import { Helmet } from "react-helmet-async"
import Button from "~/components/Button"
import ProfileCard from "~/components/ProfileCard"
import { Check, Pen } from "lucide-react"
import HeaderContainer from "~/components/HeaderContainer"
import Tabs from "~/components/Tab/Tabs"
import { useMutation, useQuery } from "@tanstack/react-query"
import { userApi } from "~/apis/user.api"
import { useParams } from "react-router-dom"
import { useToggleState } from "~/hooks/useToggleState"
import { Modal, ModalContent, ModalTrigger } from "~/components/Modal/Modal"
import InputText from "~/components/InputText"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { isAxiosUnprocessableEntityError } from "~/utils/auth"
import { ErrorResponse } from "~/types/utils.type"
import { UserSchemaYup, useValidationSchemas } from "~/utils/yupSchema"
import DatePicker from "~/components/DatePicker/DatePicker"
import { useTranslation } from "react-i18next"

const tabData = [
  { value: "tab1", label: "Thread", content: <div>Content for Tab 1</div> },
  { value: "tab2", label: "Thread trả lời", content: <div>Content for Tab 2</div> },
  { value: "tab3", label: "Bài đăng lại", content: <div>Content for Tab 3</div> }
]
type FormData = UserSchemaYup
const Profile = () => {
  const { t } = useTranslation()
  const [, setEditProfile] = useToggleState(false)

  const { username } = useParams<{ username?: string }>()
  //Fecth user profile details
  const { data: profileData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => (username ? userApi.getUserProfile(username) : userApi.getMyProfile()),
    staleTime: 1000 * 60 * 5 // cache 5 minutes
  })

  const userData = profileData?.data.data
  console.log(userData)

  // Edit user profile
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
        toast.success(data.data.message, { autoClose: 3000 })
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
    <>
      <Helmet>
        <title>hayen (@hn13.mew) on Threads</title>
        <meta name='description' content='Profile - Threads Replica' />
      </Helmet>
      <HeaderContainer />
      <ContentContainer>
        {/* Profile Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold'>hayen</h1>
            <p className='text-gray-500'>@hn13.mew</p>
            <div className='flex mt-2'>
              {/* Followers */}
              <div className='flex items-center space-x-1'>
                <img src='follower1.jpg' alt='Follower 1' className='w-6 h-6 rounded-full' />
                <img src='follower2.jpg' alt='Follower 2' className='w-6 h-6 rounded-full' />
                <span className='text-sm text-gray-500'>17 người theo dõi</span>
              </div>
            </div>
          </div>
          <img src='profile-pic.jpg' alt='Profile' className='w-16 h-16 rounded-full' />
        </div>

        {/* Edit Profile Button */}

        <Modal>
          <ModalTrigger>
            <Button
              className='text-gray-800 font-semibold text-sm p-1.5 w-full rounded-lg border mt-10'
              onClick={setEditProfile}
            >
              Chỉnh sửa trang cá nhân
            </Button>
          </ModalTrigger>
          <ModalContent>
            <form onSubmit={onSubmit}>
              <div className='p-6 flex flex-col justify-between items-center'>
                <div className='mt-4 w-full'>
                  <InputText
                    register={register}
                    type='text'
                    name='name'
                    placeholder={t("name")}
                    errorMessage={errors.name?.message}
                  />
                </div>
                <div className='w-full mt-4'>
                  <DatePicker name='date_of_birth' setValue={setValue} errorMessage={errors.date_of_birth?.message} />
                </div>
                <div className='w-full mt-4'>
                  <InputText
                    register={register}
                    type='text'
                    name='bio'
                    placeholder={t("bio")}
                    errorMessage={errors.bio?.message}
                    autoComplete='on'
                  />
                </div>
                <div className='w-full mt-4'>
                  <InputText
                    register={register}
                    type='text'
                    name='location'
                    placeholder={t("location")}
                    errorMessage={errors.location?.message}
                    autoComplete='on'
                  />
                </div>
                <div className='w-full mt-4'>
                  <InputText
                    register={register}
                    type='text'
                    name='website'
                    placeholder={t("website")}
                    errorMessage={errors.website?.message}
                    autoComplete='on'
                  />
                </div>
                <div className='w-full mt-4'>
                  <InputText
                    register={register}
                    type='text'
                    name='username'
                    placeholder={t("username")}
                    errorMessage={errors.username?.message}
                    autoComplete='on'
                  />
                </div>
                <div className='w-full mt-4'>
                  <InputText
                    register={register}
                    type='text'
                    name='avatar'
                    placeholder={t("avatar")}
                    errorMessage={errors.avatar?.message}
                    autoComplete='on'
                  />
                </div>
                <div className='w-full mt-4'>
                  <InputText
                    register={register}
                    type='text'
                    name='coverPhoto'
                    placeholder={t("coverPhoto")}
                    errorMessage={errors.cover_photo?.message}
                    autoComplete='on'
                  />
                </div>
                <div className='w-full mt-4'>
                  <Button
                    type='submit'
                    isLoading={updateMyProfileMutation.isPending}
                    disabled={updateMyProfileMutation.isPending}
                    className='w-[100%] flex justify-center bg-gray-950 text-white text-sm p-4 rounded-xl'
                  >
                    {t("save")}
                  </Button>
                </div>
              </div>
            </form>
          </ModalContent>
        </Modal>

        {/* Tabs */}
        <div className='flex mt-4 space-x-4'>
          <Tabs defaultValue='tab1' tabs={tabData} />
        </div>

        {/* New Post Input */}
        <div className='flex items-center mt-4'>
          <img src='avatar.jpg' alt='Avatar' className='w-8 h-8 rounded-full' />
          <input type='text' placeholder='Có gì mới?' className='flex-1 ml-4 p-2 border rounded-md' />
          <button className='ml-2 bg-black text-white px-4 py-1 rounded-md'>Đăng</button>
        </div>

        {/* Profile Completion Section */}
        <div className='mt-6'>
          <h2 className='text-gray-600 font-semibold'>Hoàn tất trang cá nhân</h2>
          <div className='flex mt-4 space-x-4'>
            <ProfileCard
              image='https://images.unsplash.com/photo-1719937051058-63705ed35502?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8'
              name='Tiffany Janzen'
              username='tiffintech'
              buttonText='Theo dõi'
              onButtonClick={() => alert("Followed")}
            />
            {/* <ProfileCard
              icon={<SquarePen width={20} height={20} />}
              name='Tạo thread'
              bio='Cho mọi người biết bạn đang nghĩ gì hoặc chia sẻ về một hoạt động nổi bật mới đây.'
              buttonText='Thêm'
              onButtonClick={() => alert('Add Bio clicked')}
            /> */}
            <ProfileCard
              icon={<Pen width={20} height={20} />}
              name='Thêm tiểu sử'
              bio='Hãy giới thiệu về bản thân và cho mọi người biết bạn thích gì.'
              buttonText='Thêm'
              onButtonClick={() => alert("Add Bio clicked")}
            />
            <ProfileCard
              icon={<Check width={20} height={20} />}
              name='Thêm ảnh đại diện'
              bio='Giúp mọi người dễ dàng nhận ra bạn hơn.'
              buttonText='Thêm'
              onButtonClick={() => alert("Add Bio clicked")}
            />
          </div>
        </div>
      </ContentContainer>
    </>
  )
}

export default Profile
