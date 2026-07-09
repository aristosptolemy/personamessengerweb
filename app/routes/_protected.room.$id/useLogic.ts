import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router'
import { useGroup } from '@providers/GroupProvider'

import {
  useChatRoomListener
} from '@hooks/useChatRoomListener'

import {
  useTargetRoomListener
} from '@hooks/useTargetRoomListener'

import {
  userDataGet
} from '@lib/usersLogic'

import { messageSend } from '@lib/RoomLogic'


export const useLogic = () => {
  const { id } = useParams()
  const [users, setUsers] = useState([])

  const [roomName, setRoomName] = useState('')
  const [sendText, setSendText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [invitation, setInvitation] = useState(false)
  const [menuTrayOpen, setMenuTray] = useState(false)
  const [friendDatas, setFriendDatas] = useState<any[]>([])

  

  const {
    userData,
    FriendDatas
  } = useGroup()


  const {
    roomData
  } = useTargetRoomListener(id)

  const invitationUsers = () => {
    const Participated: string[] = roomData?.members ?? []
    const users = FriendDatas?.filter((row) => !Participated.includes(row.id))
    setFriendDatas(users)
  }

  useEffect(() => {
    if (!FriendDatas || !roomData) return
    invitationUsers()
  }, [FriendDatas, roomData])
  
  const {
    messages
  } = useChatRoomListener(id)

  const usersDataSet = async () => {
    if (!roomData) return
    if (!userData?.id) return
    const members = roomData.members ?? []
    const list = []
    for (const memberId of members) {
      const result = await userDataGet(memberId)
      if (result) {
        list.push(result)
      }
    }
    setUsers(list)
    let name = roomData?.roomName ?? null
    if (!name) {
      const notMyself = list.filter((row) => row.id !== userData.id)
      name = notMyself
        .map((user) => user.displayName)
        .filter(Boolean)
        .join(',')
    } else {
      setInvitation(true)
    }
    setRoomName(name)
  }

  useEffect(() => {
    usersDataSet()
  }, [roomData, userData?.id])

  const [isSending, setIsSending] = useState(false)

  const sendMessage = async () => {
    const text = sendText.trim()

    if (!text) return
    if (!id) return
    if (!userData?.id) return
    if (isSending) return

    try {
      setIsSending(true)

      await messageSend(text, id, userData.id)

      setSendText('')
      inputRef.current?.blur()
    } catch (error) {
      console.error('メッセージ送信に失敗しました', error)
    } finally {
      setIsSending(false)
    }
  }

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTime = a.sendAt?.toMillis?.() ?? 0
      const bTime = b.sendAt?.toMillis?.() ?? 0

      return bTime - aTime
    })
  }, [messages])


  return {
    messages,
    users,
    roomData,
    userData,
    roomName,
    sendText,
    setSendText,
    sendMessage,
    sortedMessages,
    invitation,
    menuTrayOpen,
    setMenuTray,
    id,
    friendDatas
  }
}




