import { useState, useEffect } from 'react'

import { userSearch } from '@lib/usersLogic'
import toast from 'react-hot-toast'

import { useGroup } from '@providers/GroupProvider'

import { friendRequestSend } from '@lib/friendLogic'

const normalizedChange = (searchID: string) => {
  return searchID.toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_]/g, '')
}

export const useLogic = () => {
  const [searchID, setSearchID] = useState('')
  const [requestMessage, setRequstMessage] = useState('')
  const [friendUser, setFriendUser] = useState({
    comment: '',
    displayName: '',
    icon: '',
    id: '',
    imgBinary: null,
    searchID: ''
  })

  const [friendRequestOpen, setFriendRequestOpen] = useState(false)

  const {
    userData
  } = useGroup()

  const onSearch = async () => {
    const userID = userData.searchID
    if (searchID == '') {
      toast.error('IDを入力してください')
      return
    }

    const normalizedSearchID = normalizedChange(searchID)
    if (normalizedSearchID == userID) {
      toast.error('自分のIDです')
      return
    }
    const user = await userSearch(normalizedSearchID)
    setFriendUser(user)
  }

  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {

    const binary = friendUser?.imgBinary
    if (!binary) {
      setImageUrl('')
      return
    }
    let blob: Blob | null = null
    if (typeof binary.toUint8Array === 'function') {
      blob = new Blob([binary.toUint8Array()], {
        type: 'image/webp',
      })
    } else if (binary._byteString?.binaryString) {
      const uint8Array = Uint8Array.from(
        binary._byteString.binaryString,
        (char) => char.charCodeAt(0)
      )

      blob = new Blob([uint8Array], {
        type: 'image/webp',
      })
    }
    if (!blob) {
      setImageUrl('')
      return
    }
    const url = URL.createObjectURL(blob)
    setImageUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [friendUser.imgBinary])

  const friendRequest = async () => {
    setFriendRequestOpen(true)
  }

  const RequestSend = async () => {
    toast.success('送信しました')
    setFriendRequestOpen(false)
    friendRequestSend(
      friendUser.id,
      userData.id,
      requestMessage
    )
  }

  const friendRequestCancel = async () => {
    setFriendRequestOpen(false)
  }


  return {
    searchID, setSearchID,
    onSearch, friendUser,
    imageUrl, friendRequest,
    friendRequestOpen,
    setFriendRequestOpen,
    RequestSend,
    friendRequestCancel,
    requestMessage,
    setRequstMessage
  }

}


