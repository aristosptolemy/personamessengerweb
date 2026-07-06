
import { useEffect, useState } from "react"

import {
  collection,
  query,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore"
import { db } from "../lib/firebase"


export type Request = {
  id: string
  partnerID: string
  mesage: string
}


export function useFriendsListener(
  userID: string | null
) {
  const [friends, setFriends] = useState<Request[]>([])

  useEffect(() => {
    if (!userID) {
      setFriends([])
      return
    }

    const dataRef = query(
      collection(
        db, 'users', userID, 'friends'
      )
    )

    const unsubscribe = onSnapshot(
      dataRef,
      async (snapshot) => {
        
        try {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as Request[]

          setFriends(data)
        } catch {
          setFriends([])
        }
      },
      (error) => {
        console.error("リクエストデータエラー:", error)
        setFriends([])
      }
    )

    return () => {
      unsubscribe()
    }
  }, [userID])

  return {
    friends
  }
}