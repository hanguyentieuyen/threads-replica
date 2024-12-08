import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import ContentContainer from "~/components/ContentContainer"
import HeaderContainer from "~/components/HeaderContainer"
import Button from "~/components/Button"
import Tabs from "~/components/Tab/Tabs"
import { Modal, ModalContent, ModalHeader, ModalTrigger } from "~/components/Modal/Modal"
import { userApi } from "~/apis/user.api"
import { useToggleState } from "~/hooks/useToggleState"
import { ProfileHeader } from "./components/ProfileHeader"
import { EditProfileForm } from "./components/EditProfileForm"
import { ProfileCompletionSection } from "./components/ProfileCompletionSection"

const tabData = [
  { value: "tab1", label: "Thread", content: <div>Content for Tab 1</div> },
  { value: "tab2", label: "Thread trả lời", content: <div>Content for Tab 2</div> },
  { value: "tab3", label: "Bài đăng lại", content: <div>Content for Tab 3</div> }
]

const Profile = () => {
  const { t } = useTranslation()
  const [, setEditProfile] = useToggleState(false)
  const { username } = useParams<{ username?: string }>()

  const { data: profileData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => (username ? userApi.getUserProfile(username) : userApi.getMyProfile()),
    staleTime: 1000 * 60 * 5 // cache 5 minutes
  })

  const userData = profileData?.data.data

  return (
    <>
      <Helmet>
        <title>{`${userData?.name ?? "Guest"} (@${userData?.username ?? "unknown"}) on Threads`}</title>
        <meta name='description' content='Profile - Threads Replica' />
      </Helmet>
      <HeaderContainer />
      <ContentContainer>
        <ProfileHeader user={userData} />

        <Modal>
          <ModalTrigger>
            <Button
              className='text-gray-800 font-semibold text-sm p-1.5 w-full rounded-lg border mt-10'
              onClick={setEditProfile}
            >
              {t("editProfile")}
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <p className='text-gray-600 font-semibold pt-2'>{t("editProfile")}</p>
            </ModalHeader>
            <EditProfileForm />
          </ModalContent>
        </Modal>

        <div className='flex mt-4 space-x-4'>
          <Tabs defaultValue='tab1' tabs={tabData} />
        </div>

        <div className='flex items-center mt-4'>
          <img src={userData?.avatar} alt='Avatar' className='w-8 h-8 rounded-full' />
          <input type='text' placeholder={t("whatIsNew")} className='flex-1 ml-4 p-2 border rounded-md' />
          <button className='ml-2 bg-black text-white px-4 py-1 rounded-md'>{t("post")}</button>
        </div>

        <ProfileCompletionSection />
      </ContentContainer>
    </>
  )
}

export default Profile
