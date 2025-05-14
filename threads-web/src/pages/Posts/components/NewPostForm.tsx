/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { useMutation } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { hashtagApi } from "~/apis/hashtag.api"
import { postApi } from "~/apis/post.api"
import Button from "~/components/Button"
import ButtonUploadMedia from "~/components/ButtonUploadMedia"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/Dropdown"
import Icon from "~/components/Icon"
import InputText from "~/components/InputText"
//import Textarea from "~/components/Textarea"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { PostAudience, PostType } from "~/constant/enum"
import { Hashtag } from "~/types/hashtag.type"
import { CreatePostSchemaYup } from "~/utils/yupSchema"

type FormData = CreatePostSchemaYup

export default function NewPostForm() {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [content, setContent] = useState("")
  const [suggestions, setSuggestions] = useState<Hashtag[]>([])
  const [uploadedMedias, setUploadedMedias] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedAudience, setSelectedAudience] = useState<string>(t("everyone"))

  // media url: https://threads-replica.s3.ap-southeast-1.amazonaws.com/images/9998fcdcfe7e048a9e92e5101.jpg
  //console.log("uploadedMedia: ", uploadedMedias)

  const handleAudienceChange = (value: string) => {
    setSelectedAudience(value)
  }

  const { register, handleSubmit, setValue, reset } = useForm<FormData>()

  const createPostMutation = useMutation({
    mutationFn: (body: FormData) => postApi.create(body)
  })

  const onSubmit = handleSubmit((data) => {
    console.log("data:", data)

    const newPost: FormData = {
      type: PostType.Post,
      content: data.content,
      audience: selectedAudience === "everyone" ? PostAudience.Everyone : PostAudience.Everyone,
      hashtags: [],
      medias: [],
      mentions: [],
      parent_id: null
    }
    console.log("new post: ", newPost)

    createPostMutation.mutate(newPost, {
      onSuccess: (data) => {
        reset()
        setValue("content", "")
        setUploadedMedias([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        toast.success(data.data.message, { autoClose: 3000 })
      },
      onError: (error) => {
        console.error(error)
      }
    })
  })

  const handleRemoveMedia = (val: string) => {
    setUploadedMedias(uploadedMedias.filter((url) => url !== val))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Giả lập API search hashtag
  const searchHashtags = async (query: string) => {
    if (!query) return setShowDropdown(false)
    const res = await hashtagApi.search(query)

    setSuggestions(res.data.data ?? [])
    console.log(suggestions)
    setShowDropdown(res.data.data !== undefined && res.data.data.length > 0)
  }

  const handleInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
    const cursorPos = e.target.selectionStart || undefined
    const textBeforeCursor = e.target.value.slice(0, cursorPos)
    const match = textBeforeCursor.match(/#(\w*)$/) // Tìm `#` gần nhất

    if (match) {
      searchHashtags(match[1]) // Gửi từ khóa sau `#` đến API
    } else {
      setShowDropdown(false)
    }
  }
  const insertHashtag = (tag: Hashtag) => {
    console.log("tag: ", tag)
    const cursorPos = inputRef.current?.selectionStart || 0
    const textBeforeCursor = content.slice(0, cursorPos).replace(/#\w*$/, "") // Xóa từ đang nhập
    const textAfterCursor = content.slice(cursorPos)
    const newText = textBeforeCursor + tag + " " + textAfterCursor

    setContent(newText)
    setShowDropdown(false)
  }

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <form onSubmit={onSubmit}>
        <div className='flex flex-row items-center justify-between border-b p-2 mx-[-8px]'>
          <Button className='text-muted-foreground'>Hủy</Button>
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
              {/* <Textarea
                register={register}
                ref={inputRef}
                placeholder='Có gì mới?'
                value={content}
                onChange={handleInputText}
              /> */}
              <InputText register={register} type='text' name='content' onChange={handleInputText} />
              {uploadedMedias.map((url) => (
                <div key={url} className='relative mt-2 rounded-lg overflow-hidden group'>
                  <div className='relative bg-neutral2-1 p-2 rounded-lg'>
                    <img src={url} className='w-full min-h-10 object-cover rounded' width={300} height={200} />
                    {isUploading && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded'>
                        <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveMedia(url)}
                      className='absolute top-4 right-4 p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity opacity-0 group-hover:opacity-100'
                      disabled={isUploading}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 text-white'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <Popover open={showDropdown}>
                <PopoverTrigger>
                  <div />
                </PopoverTrigger>
                <PopoverContent>
                  {suggestions.map((tag) => (
                    <div
                      key={tag._id}
                      className='p-2 hover:bg-gray-200 cursor-pointer'
                      onClick={() => insertHashtag(tag)}
                    >
                      {tag.name}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 p-2 pt-0'>
          <div className='flex items-center gap-4 w-full'>
            <ButtonUploadMedia
              fileInputRef={fileInputRef}
              setIsUploading={setIsUploading}
              setUploadedMedias={setUploadedMedias}
            />
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className='text-sm text-muted-foreground'>{selectedAudience}</div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className='text-sm text-muted-foreground'
                  value={PostAudience.Everyone}
                  onClick={() => handleAudienceChange(t("everyone"))}
                >
                  Bất kỳ ai cũng có thể trả lời và trích dẫn
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='text-sm text-muted-foreground'
                  value={PostAudience.FewSomeone}
                  onClick={() => handleAudienceChange(t("userFollowings"))}
                >
                  Trang cá nhân mà bạn theo dõi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type='submit' className='text-gray-800 font-semibold text-sm p-2 rounded-lg border'>
              {t("post")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
