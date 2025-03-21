import { useTranslation } from "react-i18next"
import Icon from "~/components/Icon"
import ProfileCard from "~/components/ProfileCard"

export const ProfileCompletionSection: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className='w-full'>
      <h2 className='text-gray-600 font-semibold'>{t("completeProfile")}</h2>
      <div className='flex mt-4 space-x-4'>
        <ProfileCard
          image='https://images.unsplash.com/photo-1719937051058-63705ed35502?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8'
          name='Tiffany Janzen'
          username='tiffintech'
          buttonText={t("follow")}
          onButtonClick={() => alert("Followed")}
        />
        <ProfileCard
          icon={<Icon name='Pen' width={20} height={20} />}
          name={t("addBio")}
          bio={t("addBioDescription")}
          buttonText={t("add")}
          onButtonClick={() => alert("Add Bio clicked")}
        />
        <ProfileCard
          icon={<Icon name='Check' width={20} height={20} />}
          name={t("addAvatar")}
          bio={t("addAvatarDescription")}
          buttonText={t("add")}
          onButtonClick={() => alert("Add Avatar clicked")}
        />
      </div>
    </div>
  )
}
