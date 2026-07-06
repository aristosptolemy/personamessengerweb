
import { useEffect, useState } from "react"

import {
  doc,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore"
import { db } from "../lib/firebase"


export function useTargetRoomListener(
  roomID: string | null
) {
  const [roomData, setRoomData] = useState(null)

  useEffect(() => {
    if (!roomID) {
      setRoomData(null)
      return
    }

    const userRef = doc(
      db, 'rooms', roomID
    )

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setRoomData(null)
          return
        }
        
        const data = {
          id: snapshot.id,
          ...snapshot.data(),
        }

        setRoomData(data)
      },
      (error) => {
        console.error("ユーザーデータエラー:", error)
        setRoomData(null)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [roomID])

  return {
    roomData
  }
}