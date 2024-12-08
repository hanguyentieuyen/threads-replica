import Icon from "~/components/Icon"
import InputText from "~/components/InputText"
import { Button } from "~/components/ui/button"

export default function NewThread() {
  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div className='flex flex-row items-center justify-between border-b p-2'>
        <Button variant='ghost' className='text-muted-foreground'>
          Hủy
        </Button>
        <h1 className='text-lg font-semibold'>Thread mới</h1>
        <div className='w-10' />
      </div>

      <div className='p-2'>
        <div className='flex gap-3'>
          <div className='w-10 h-10'>
            <img src='/placeholder.svg' alt='avatar' />
          </div>

          <div className='flex-1'>
            <div className='font-medium mb-1 float-start'>hn13.mew</div>
            <InputText placeholder='Có gì mới?' className='border-0 p-0 text-base focus-visible:ring-0 h-auto' />
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4 p-2 pt-0'>
        <div className='flex items-center gap-2 w-full border-t pt-4'>
          <Button variant='ghost' size='icon' className='text-muted-foreground'>
            <Icon name='Image' className='w-5 h-5' />
          </Button>
          <Button variant='ghost' size='icon' className='text-muted-foreground'>
            <Icon name='SmilePlus' className='w-5 h-5' />
          </Button>
          <Button variant='ghost' size='icon' className='text-muted-foreground'>
            <Icon name='Hash' className='w-5 h-5' />
          </Button>
        </div>

        <div className='flex items-center gap-3 w-full'>
          <div className='w-6 h-6'>
            <img src='/placeholder.svg' />
            <div>+</div>
          </div>
          <span className='text-muted-foreground text-sm'>Thêm vào thread</span>
        </div>

        <div className='w-full flex justify-between items-center border-t pt-4'>
          <div className='text-sm text-muted-foreground'>Bất kỳ ai cũng có thể trả lời và trích dẫn</div>
          <Button>Đăng</Button>
        </div>
      </div>
    </div>
  )
}
