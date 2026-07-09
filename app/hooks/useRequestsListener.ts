
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
  message: string
  type: string
  roomName?: string
}


export function useRequestsListener(
  userID: string | null
) {
  const [requests, setRequests] = useState<Request[]>([])

  useEffect(() => {
    if (!userID) {
      setRequests([])
      return
    }

    const dataRef = query(
      collection(
        db, 'users', userID, 'Requests'
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

          setRequests(data)
        } catch {
          setRequests([])
        }
      },
      (error) => {
        console.error("リクエストデータエラー:", error)
        setRequests([])
      }
    )

    return () => {
      unsubscribe()
    }
  }, [userID])

  return {
    requests
  }
}