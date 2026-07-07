import { useNavigate } from 'react-router-dom'

import {
  useState, useRef, useEffect, useCallback
} from 'react'

import { userDataGet, userDataSet } from '@lib/usersLogic'

import { useForm } from 'react-hook-form'

import { useDropzone } from 'react-dropzone'

import { convertToWebPBytes } from '@lib/ImgFormat'

import toast from 'react-hot-toast'


import { useGroup } from '@providers/GroupProvider'

export const useLogic = () => {
  const navigate = useNavigate()
  const [FileUIDisplay, setFileUIDisplay] = useState(false)

  const {
    handleSubmit,
    register,
    reset
  } = useForm({
    defaultValues: {
      searchID: '',
      displayName: '',
      icon: '',
      comment: '',
      imgBinary: null
    }
  })

  const {
    setUserId,
    userData
  } = useGroup()

  useEffect(() => {
    if(!userData) return
    reset({
      ...userData
    })
  }, [userData])

  const id = userData ? userData.id : null

  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const previewUrlRef = useRef<string | null>(null)

  const updatePreviewUrl = useCallback((url: string | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }
    previewUrlRef.current = url
    setPreviewUrl(url)
  }, [])


  useEffect(() => {
    if (!userData?.imgBinary) {
      updatePreviewUrl(null)
      return
    }
    const uint8Array = userData.imgBinary.toUint8Array()
    const blob = new Blob([uint8Array], {
      type: 'image/webp',
    })
    const objectUrl = URL.createObjectURL(blob)
    updatePreviewUrl(objectUrl)
  }, [userData?.imgBinary, updatePreviewUrl])

  // 新しく画像を選択した時のプレビュー
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setPhotoFile(file)
    updatePreviewUrl(objectUrl)
  }, [updatePreviewUrl])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: false,
  })

  const onSubmit = async(data) => {
    const allData = { ...data }

    if (photoFile) {
      const webpBinary = await convertToWebPBytes(photoFile, 300, 0.85)
      allData.imgBinary = webpBinary
    }
    if (!id) return

    const result = await userDataSet(id, allData)

    if (!result.ok) {
      toast.error(result.text)
    } else {
      toast.success(result.text)
      setUserId(id)
      navigate('/')
    }
  }


  return {
    register,
    handleSubmit,
    getRootProps,
    getInputProps,
    isDragActive,
    previewUrl,
    FileUIDisplay,
    onSubmit
  }
}