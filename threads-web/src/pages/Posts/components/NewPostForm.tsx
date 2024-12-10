import { useTranslation } from "react-i18next"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import InputText from "~/components/InputText"

export default function NewThread() {
  const { t } = useTranslation()
  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div className='flex flex-row items-center justify-between border-b p-2 mx-[-8px]'>
        <Button variant='ghost' className='text-muted-foreground'>
          Hủy
        </Button>
        <h1 className='text-lg font-semibold'>Thread mới</h1>
        <div className='w-10' />
      </div>

      <div className='p-2 w-full mt-2'>
        <div className='flex gap-3'>
          <div className='w-10 h-10'>
            <img src='../src/assets/capy.jpg' alt='avatar' className='w-10 h-10 rounded-full' />
          </div>

          <div className='flex-1'>
            <div className='font-medium mb-1 float-start text-sm'>hn13.mew</div>
            <InputText placeholder='Có gì mới?' className='border-0 p-0 text-base focus-visible:ring-0 h-auto' />
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4 p-2 pt-0'>
        <div className='flex items-center gap-4 w-full'>
          <Button className='text-muted-foreground'>
            <Icon name='Image' className='w-5 h-5' />
          </Button>
          <Button className='text-muted-foreground'>
            <Icon name='SmilePlus' className='w-5 h-5' />
          </Button>
          <Button className='text-muted-foreground'>
            <Icon name='Hash' className='w-5 h-5' />
          </Button>
        </div>

        <div className='flex items-center gap-3 w-full'>
          <img src='../src/assets/capela.jpg' className='w-6 h-6 rounded' />
          <span className='text-muted-foreground text-sm'>Thêm vào thread</span>
        </div>

        <div className='w-full flex justify-between items-center pt-2'>
          <div className='text-sm text-muted-foreground'>Bất kỳ ai cũng có thể trả lời và trích dẫn</div>
          <Button className='text-gray-800 font-semibold text-sm p-2 rounded-lg border'>{t("post")}</Button>
        </div>
      </div>
    </div>
  )
}
