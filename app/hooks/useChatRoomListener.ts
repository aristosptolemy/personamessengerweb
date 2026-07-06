import { useEffect, useState } from 'react'

import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  Timestamp,
  type FirestoreError,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

import {
  getMessagesFromIndexedDB,
  saveMessagesToIndexedDB,
  getLastSyncedAt,
  setLastSyncedAt,
} from '@lib/IndexedDB'

export type Message = {
  id: string
  sendID: string
  message: string
  sendAt: Timestamp
  updateAt?: Timestamp
}

export function useChatRoomListener(
  RoomID: string | null
) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!RoomID) {
      setMessages([])
      return
    }

    let isMounted = true

    const setup = async () => {
      const cachedMessages = await getMessagesFromIndexedDB(RoomID)

      if (!isMounted) return

      setMessages(cachedMessages)

      const lastSyncedAt = await getLastSyncedAt(RoomID)

      const messagesRef = collection(
        db,
        'rooms',
        RoomID,
        'messages'
      )

      const dataQuery = query(
        messagesRef,
        where('updateAt', '>', Timestamp.fromMillis(lastSyncedAt)),
        orderBy('updateAt', 'desc')
      )

      const unsubscribe = onSnapshot(
        dataQuery,
        async (snapshot) => {
          try {
            const changedMessages = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Message[]

            if (changedMessages.length === 0) return

            await saveMessagesToIndexedDB(RoomID, changedMessages)

            const latestUpdatedAt = Math.max(
              ...changedMessages.map((message) => {
                const updatedAt = message.updateAt ?? message.sendAt
                return updatedAt.toMillis()
              })
            )

            await setLastSyncedAt(RoomID, latestUpdatedAt)

            const latestMessages = await getMessagesFromIndexedDB(RoomID)

            if (!isMounted) return

            setMessages(latestMessages)
          } catch (error) {
            console.error('メッセージ同期エラー:', error)
          }
        },
        (error: FirestoreError) => {
          console.error('メッセージ取得エラー:', error)
        }
      )

      return unsubscribe
    }

    let unsubscribe: (() => void) | undefined

    setup().then((result) => {
      unsubscribe = result
    })

    return () => {
      isMounted = false

      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [RoomID])

  return {
    messages,
  }
}