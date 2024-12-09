import { useTranslation } from "react-i18next"
import Button from "~/components/Button"
import ContentContainer from "~/components/ContentContainer"
import FollowerCard from "~/components/FollowerCard"
import InputText from "~/components/InputText"

export default function Search() {
  const { t } = useTranslation()
  const fakeData = Array.from({ length: 10 }, (_, index) => index + 1)
  console.log(fakeData)
  return (
    <div>
      <div className='sticky top-0 z-10'>
        <Button className='min-w-28 font-semibold text-gray-700 text-sm h-16'>{t("search")}</Button>
      </div>
      <ContentContainer>
        <div className='p-4'>
          <InputText placeholder='Search' name='searchText' className='my-3 text-sm' autoFocus />
        </div>
        <p className='w-full text-slate-400 text-sm font-semibold text-left pl-4'>{t("suggestedFollowUp")}</p>
        {fakeData.map((item) => (
          <div key={item} className='p-4 border-b last:border-b-0'>
            <FollowerCard
              username='@hayen'
              fullName='Hayen'
              profileImage='../src/assets/capela.jpg'
              followersCount={34}
              isVerified
            />
          </div>
        ))}
      </ContentContainer>
    </div>
  )
}
