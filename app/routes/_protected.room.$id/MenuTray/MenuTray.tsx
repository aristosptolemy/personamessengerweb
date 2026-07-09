import styles from './Style.module.css'
import InputArea from '@comp/InputArea/InputArea'
import CostomButton from '~/comp/CostomButton/Button'
import TitleArea from '~/comp/TitleArea/TitleArea'


import { GroupRoomRequestSend } from '@lib/RoomLogic'

import toast from 'react-hot-toast'


export default function MenuTray({
  roomID,
  friends,
  MyID,
  roomName
}) {

  const invitation = async (id: string) => {
    const result = await GroupRoomRequestSend(id,MyID,roomID,roomName)
    if (result.ok) {
      toast.success(result.text)
    } else {
      toast.error(result.text)
    }
  }

  return (
    <div>
      <div className={styles.Main}>
        <div>
          <TitleArea>
            フレンドを招待
          </TitleArea>
        </div>
        <div className={styles.friendsArea}>
          {friends.map((row) => (
            <div key={row.id} className={styles.Row}>
              <InputArea>
                {row.displayName}
              </InputArea>
              <CostomButton
                buttonName='招待'
                action={() => invitation(row.id)}
              />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}



