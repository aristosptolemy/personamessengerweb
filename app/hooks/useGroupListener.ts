// 選択された組織のデータの監視

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@lib/firebase"



export type GroupData = {
  id: string
  AccountID?: string
  name?: string
  createdAt?: unknown
}

export function useGroupListener(groupId: string | null) {
  const [group, setGroup] = useState<GroupData | null>(null)
  const [groupLoading, setGroupLoading] = useState(true)

  useEffect(() => {
    if (!groupId) {
      setGroup(null)
      setGroupLoading(false)
      return
    }

    setGroupLoading(true)

    const unsubscribe = onSnapshot(
      doc(db, "Groups", groupId),
      (snapshot) => {
        if (!snapshot.exists()) {
          setGroup(null)
          setGroupLoading(false)
          return
        }
        const updatedGroup = {
          id: snapshot.id,
          ...snapshot.data(),
        }
        localStorage.setItem('groupData', JSON.stringify(updatedGroup))
        setGroup({
          id: snapshot.id,
          ...snapshot.data(),
        } as GroupData)

        setGroupLoading(false)
      },
      (error) => {
        console.error("グループ監視エラー:", error)
        setGroup(null)
        setGroupLoading(false)
      }
    )

    return () => unsubscribe()
  }, [groupId])

  return {
    group,
    groupLoading,
  }
}