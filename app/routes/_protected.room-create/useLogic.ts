import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { useGroup } from '@providers/GroupProvider'

import { roomCreate } from '@lib/RoomLogic'

import toast from 'react-hot-toast'

import { useNavigate } from 'react-router-dom'

export const useLogic = () => {
  const navigate = useNavigate()

  const {
    userData
  } = useGroup()

  const {
    register,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      roomName: '',
      roomID: '',
      ownerID: '',
    }
  })

  useEffect(() => {
    if (!userData) return
    const id = userData.id
    reset({
      roomName: '',
      roomID: '',
      ownerID: id,
    })
  }, [userData])


  const onSubmit = async (data) => {
    const id = userData.id
    const allData = {
      ...data,
      members: [id],
      memberMap: [{
        [id]: true
      }],
      ownerID: id
    }

    const result = await roomCreate(allData)
    if (!result.ok) {
      toast.error(result.text)
    } else {
      toast.success(result.text)
      navigate('/')
    }
  }


  return {
    register,
    handleSubmit,
    onSubmit
  }
}