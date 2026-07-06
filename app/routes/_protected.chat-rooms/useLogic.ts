import { useEffect, useState } from 'react'
import { useGroup } from '@providers/GroupProvider'
import { userDataGet } from '@lib/usersLogic'

import { useNavigate } from 'react-router-dom'

type Room = {
  id: string
  roomName?: string
  members: string[]
}

type DisplayRoom = Room & {
  displayRoomName: string
}

export const useLogic = () => {
  const { userData, rooms } = useGroup()
  const navigate = useNavigate()

  const [displayRooms, setDisplayRooms] = useState<DisplayRoom[]>([])

  useEffect(() => {
    if (!rooms || !userData) return

    const loadRoomNames = async () => {
      const result = await Promise.all(
        rooms.map(async (room: Room) => {
          if (room.roomName) {
            return {
              ...room,
              displayRoomName: room.roomName,
            }
          }

          const otherMemberIDs = room.members.filter(
            (uid) => uid !== userData.id
          )

          const memberNames = await Promise.all(
            otherMemberIDs.map(async (uid) => {
              const targetuserData = await userDataGet(uid)
              return targetuserData?.displayName ?? 'Unknown'
            })
          )

          return {
            ...room,
            displayRoomName: memberNames.join(', '),
          }
        })
      )

      setDisplayRooms(result)
    }

    loadRoomNames()
  }, [rooms, userData])

  const GoToRoom = (id: string) => {
    navigate(`/room/${id}`)
  }

  return {
    displayRooms,
    GoToRoom
  }
}