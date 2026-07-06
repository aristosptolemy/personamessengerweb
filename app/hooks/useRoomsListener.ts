
import { useEffect, useState } from "react"

import {
  collection,
  query,
  onSnapshot,
  where,
  type Timestamp,
} from "firebase/firestore"
import { db } from "../lib/firebase"


export type Request = {
  id: string
  members: string[]
  memberMap: any
}


export function useRoomsListener(
  userID: string | null
) {
  const [rooms, setRooms] = useState<Request[]>([])

  useEffect(() => {
    if (!userID) {
      setRooms([])
      return
    }

    const dataRef = query(
      collection(db, 'rooms'),
      where(`memberMap.${userID}`, '==', true)
    )

    const unsubscribe = onSnapshot(
      dataRef,
      async (snapshot) => {
        
        try {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as Request[]

          setRooms(data)
        } catch {
          setRooms([])
        }
      },
      (error) => {
        console.error("リクエストデータエラー:", error)
        setRooms([])
      }
    )

    return () => {
      unsubscribe()
    }
  }, [userID])

  return {
    rooms
  }
}