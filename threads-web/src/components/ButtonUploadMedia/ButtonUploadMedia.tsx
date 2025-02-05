import React from "react"
import { mediaApi } from "~/apis/media.api"
import Icon from "../Icon"
import Button from "../Button"

type ButtonUploadMediaProps = {
  setPreviewUrl: (value: string) => void
  setUploadedMedia: (value: string) => void
  setIsUploading: (value: boolean) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export default function ButtonUploadMedia({
  setPreviewUrl,
  setUploadedMedia,
  setIsUploading,
  fileInputRef
}: ButtonUploadMediaProps) {
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

  const uploadFile = async (file: File): Promise<string> => {
    if (file.type.startsWith("image/")) {
      const response = await mediaApi.uploadImage(file)
      return response?.data.data?.url || ""
    } else if (file.type.startsWith("video/")) {
      const response = await mediaApi.uploadVideo(file)
      return response?.data.data?.url || ""
    }
    return URL.createObjectURL(file)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      validateFile(file)
      setIsUploading(true)

      const previewUrl = await readFileAsDataURL(file)
      setPreviewUrl(previewUrl)

      const uploadedUrl = await uploadFile(file)
      setUploadedMedia(uploadedUrl)
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
      <input type='file' ref={fileInputRef} onChange={handleFileChange} accept='image/*,video/*' className='hidden' />
    </>
  )
}
