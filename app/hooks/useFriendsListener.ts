
import { useEffect, useState } from "react"

import {
  collection,
  query,
  onSnapshot,
  type Timestamp,
  doc,
  getDoc
} from "firebase/firestore"
import { db } from "../lib/firebase"


export type Request = {
  id: string
  partnerID: string
  message: string
}


export function useFriendsListener(
  userID: string | null
) {
  const [friends, setFriends] = useState<Request[]>([])

  const [FriendDatas, setFriendDatas] = useState([])

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

          const Datas = []

          for (const row of data) {
            const userRef = doc(db, 'users', row.id)
            const userSnap = await getDoc(userRef)
            const userData = userSnap.exists()
              ? {
                  id: userSnap.id,
                  ...userSnap.data()
                } as any
              : null
            Datas.push(userData)
          }

          setFriendDatas(Datas)


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
    friends,
    FriendDatas
  }
}