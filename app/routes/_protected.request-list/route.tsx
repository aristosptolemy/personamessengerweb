import { useLogic } from './useLogic'
import styles from './Style.module.css'

import TitleArea from '@comp/TitleArea/TitleArea'

import UserRow from './userRow'
import RoomRow from './roomRow'

import { useState, useEffect } from 'react'


export default function Requests() {

  const {
    requests,
    userData
  } = useLogic()

  const [friendState, setFriendState] = useState(false)
  const [roomState, setRoomState] = useState(false)

  const friendRequests = () => {
    const rows = requests.filter((row) => row.type == 'friend')
    if (rows.length === 0) {
      setFriendState(false)
    } else {
      setFriendState(true)
    }
  }

  const roomRequests = () => {
    const rows = requests.filter((row) => row.type == 'groupRoom')
    if (rows.length === 0) {
      setRoomState(false)
    } else {
      setRoomState(true)
    }
  }

  useEffect(() => {
    friendRequests()
    roomRequests()
  }, [requests])

  return (
    <div className={styles.MainBG}>
      <div className={`${styles.friendsReq} ${friendState ? styles.friendson : styles.friendsoff}`}>
        <div className={styles.TitleArea}>
          <TitleArea>
            FriendRequest
          </TitleArea>
        </div>

        <div className={styles.Users}>
          {requests?.filter((row) => row.type == 'friend').map((row) => (
            <UserRow
              id={row.partnerID}
              MyID={userData.id}
              requestID={row.id}
            />
          ))}
        </div>
      </div>

      
      <div className={`${styles.roomsReq} ${roomState ? styles.roomson : styles.roomsoff}`}>
        <div className={styles.TitleArea}>
          <TitleArea>
            RoomRequest
          </TitleArea>
        </div>

        <div className={styles.Users}>
          {requests?.filter((row) => row.type == 'groupRoom').map((row) => (
            <RoomRow
              id={row.partnerID}
              MyID={userData.id}
              requestID={row.id}
              requestData={row}
            />
          ))}
          
        </div>
      </div>


    </div>
  )
}



