import { useLogic } from './useLogic'
import styles from './Style.module.css'

import TitleArea from '@comp/TitleArea/TitleArea'

import UserRow from './userRow'


export default function FriendList() {
  const {
    friendDatas
  } = useLogic()

  return (
    <div className={styles.MainBG}>
      <div className={styles.TitleArea}>
        <TitleArea>
          Friends
        </TitleArea>
      </div>
      <div className={styles.FriendsArea}>
        {friendDatas.map((row) => (
          <UserRow
            id={row.id}
          />
        ))}
      </div>
    </div>
  )
}












