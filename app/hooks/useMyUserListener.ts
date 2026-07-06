
import { useEffect, useState } from "react"

import {
  doc,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore"
import { db } from "../lib/firebase"


export function useUserListener(
  userID: string | null
) {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (!userID) {
      setUserData(null)
      return
    }

    const userRef = doc(
      db, 'users', userID
    )

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setUserData(null)
          return
        }
        
        const data = {
          id: snapshot.id,
          ...snapshot.data(),
        }

        setUserData(data)

      },
      (error) => {
        console.error("ユーザーデータエラー:", error)
        setUserData(null)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [userID])

  return {
    userData
  }
}