import styles from './Style.module.css'
import { useEffect, useState } from 'react'
import InputArea from '@comp/InputArea/InputArea'
import CostomButton from '@comp/CostomButton/Button'

import { RoomCompletion } from '@lib/requestLogic'

import { RoomDataGet } from '@lib/RoomLogic'



export default function RoomRow({
  id,
  MyID,
  requestID,
  requestData
}) {
  const [target, setTarget] = useState(null)
  

  const roomDataSet = async() => {
    const result = await RoomDataGet(requestData.roomID)
    setTarget(result)
  }

  useEffect(() => {
    roomDataSet()
  }, [id])

  const permission = async() => {
    RoomCompletion(MyID, requestData.roomID, requestID)

  }

  const NotAllowed = async() => {
    console.log('不許可')
  }

  return (
    <div className={styles.Row}>
      <div className={styles.datas}>
        <div>
          <InputArea>
            <div className={styles.Maindata}>
              <div className={styles.search}>
                {target?.roomID ?? ''}
              </div>
              <div className={styles.Display}>
                {requestData.roomName ?? ''}
              </div>
            </div>
          </InputArea>
        </div>
      </div>
      <div className={styles.ButtonArea}>
        <CostomButton
          buttonName='参加'
          action={permission}
        />
        <CostomButton
          buttonName='不参加'
          action={NotAllowed}
        />
      </div>

    </div>
  )
}