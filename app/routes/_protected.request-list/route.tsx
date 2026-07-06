import { useLogic } from './useLogic'
import styles from './Style.module.css'

import TitleArea from '@comp/TitleArea/TitleArea'

import UserRow from './userRow'


export default function Requests() {

  const {
    requests,
    userData
  } = useLogic()
  return (
    <div className={styles.MainBG}>
      <div className={styles.TitleArea}>
        <TitleArea>
          RequestList
        </TitleArea>
      </div>


      <div className={styles.Users}>
        {requests?.map((row) => (
          <UserRow
            id={row.partnerID}
            MyID={userData.id}
            requestID={row.id}
          />
        ))}
        
      </div>
    </div>
  )
}



