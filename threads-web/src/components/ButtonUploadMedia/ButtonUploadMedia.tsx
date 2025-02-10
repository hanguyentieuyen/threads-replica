import React from "react"
import { mediaApi } from "~/apis/media.api"
import Icon from "../Icon"
import Button from "../Button"
import { Media } from "~/types/media.type"

type ButtonUploadMediaProps = {
  fileInputRef: React.RefObject<HTMLInputElement>
  setPreviewUrls?: (value: string[]) => void // get file base 64: not recommended to use this way
  setUploadedMedias: (value: string[]) => void
  setIsUploading: (value: boolean) => void
}

export default function ButtonUploadMedia({
  setPreviewUrls,
  setUploadedMedias,
  setIsUploading,
  fileInputRef
}: ButtonUploadMediaProps) {
  const MAX_IMAGES = 5
  const MAX_VIDEOS = 1

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      throw new Error("File type is not supported")
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size is too large")
    }
  }

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const uploadFile = async (file: File): Promise<string[]> => {
    const response = file.type.startsWith("image/")
      ? await mediaApi.uploadImage(file)
      : await mediaApi.uploadVideo(file)

    const data = response?.data?.data
    if (!data) return []

    return Array.isArray(data) ? data.map((item) => item.url) : [(data as Media).url].filter(Boolean)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Filter and limit images and video files
    const images = files.filter((file) => file.type.startsWith("image/")).slice(0, MAX_IMAGES)
    const videos = files.filter((file) => file.type.startsWith("video/")).slice(0, MAX_VIDEOS)

    if (images.length === 0 && videos.length === 0) return

    try {
      setIsUploading(true)

      // validate each file
      for (const file of [...images, ...videos]) {
        validateFile(file)
      }

      // get preview base64 encoded urls list
      const previewUrls = await Promise.all([...images, ...videos].map(readFileAsDataURL))
      setPreviewUrls?.(previewUrls)
      // upload all files
      const uploadedUrls = (await Promise.all([...images, ...videos].map(uploadFile))).flat()
      setUploadedMedias(uploadedUrls)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <Button type='button' onClick={handleButtonClick} className='text-muted-foreground'>
        <Icon name='Image' className='w-5 h-5' />
      </Button>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/*,video/*'
        multiple
        className='hidden'
      />
    </>
  )
}
