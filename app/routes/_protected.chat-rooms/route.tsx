
import styles from './Style.module.css'
import { useLogic } from './useLogic'

import TitleArea from '@comp/TitleArea/TitleArea'

import DisplayArea from '@comp/DisplayName/DisplayName'

import CostomButton from '@comp/CostomButton/Button'

import { userDataGet } from '@lib/usersLogic'


export default function Rooms() {
  const {
    displayRooms,
    GoToRoom
  } = useLogic()
  
  return (
    <div className={styles.MainBG}>
      <div className={styles.TitleArea}>
        <TitleArea>
          ChatRooms
        </TitleArea>
      </div>
      {displayRooms?.map((row) => (
        <div className={styles.Row}
          key={row.id}
        >
          <div>
            <DisplayArea>
              {row.displayRoomName}
            </DisplayArea>
          </div>
          <div>
            <CostomButton
              buttonName='GoTo'
              action={() => GoToRoom(row.id)}
            />
          </div>

        </div>
      ))}
    </div>
  )
}




