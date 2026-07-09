import {
  createContext,
  useContext,
  type ReactNode,
  useState
} from "react"

import {
  useGroupListener,
  type GroupData,
} from "../hooks/useGroupListener"

import {
  useUserListener
} from "@hooks/useMyUserListener"

import {
  useRequestsListener,
  type Request
} from '@hooks/useRequestsListener'


import {
  useFriendsListener
} from '@hooks/useFriendsListener'

import {
  useRoomsListener
} from '@hooks/useRoomsListener'


type GroupContextValue = {
  groupId: string | null
  setUserId: (groupId: string | null) => void
  group: GroupData | null
  userData?: any
  requests?: Request[]
  friends?: any[]
  FriendDatas?: any[]
  rooms?: any[]
}

const GroupContext = createContext<GroupContextValue | null>(null)


type Props = {
  children: ReactNode
}

export function GroupProvider({ children }: Props) {
  const [groupId, setGroupIdState] = useState<string | null>(() => {
    const localData = localStorage.getItem("groupData")
    if (!localData) return null
    try {
      const groupData = JSON.parse(localData)
      return groupData?.id ?? null
    } catch {
      return null
    }
  })

  const [userID, setUserIDState] = useState<string | null>(() => {
    const localData = localStorage.getItem("userData")
    if (!localData) return null
    try {
      const userData = JSON.parse(localData)
      return userData?.id ?? null
    } catch {
      return null
    }
  })

  const setUserId = (newGroupId: string | null) => {
    setUserIDState(newGroupId)
  }

  const { group, groupLoading } = useGroupListener(groupId)

  const { userData } = useUserListener(userID)

  const { requests } = useRequestsListener(userID)

  const { friends, FriendDatas } = useFriendsListener(userID)

  const { rooms } = useRoomsListener(userID)


  return (
    <GroupContext.Provider
      value={{
        groupId,
        setUserId,
        group,
        userData,
        requests,
        friends,
        FriendDatas,
        rooms,
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}


export function useGroup() {
  const context = useContext(GroupContext)

  if (!context) {
    throw new Error("useGroup は GroupProvider の内側で使用してください")
  }

  return context
}