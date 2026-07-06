import styles from './Style.module.css'
import { useEffect, useState } from 'react'
import IconArea from '@comp/Icon/IconArea'
import InputArea from '@comp/InputArea/InputArea'
import CostomButton from '@comp/CostomButton/Button'

import { userDataGet } from '@lib/usersLogic'

import { Completion } from '@lib/requestLogic'

import MessageArea from '@comp/MessageArea/MessageArea'

export default function UserRow({
  id,
  MyID = ''
}) {
  const [target, setTarget] = useState(null)
  const [imageUrl, setImageUrl] = useState('')

  const userDataSet = async() => {
    const result = await userDataGet(id)
    setTarget(result)
  }

  useEffect(() => {
    userDataSet()
  }, [id])

  useEffect(() => {
    if (!target || !target?.imgBinary) return

    const binary = target?.imgBinary
    if (!binary) {
      setImageUrl('')
      return
    }
    let blob: Blob | null = null
    if (typeof binary.toUint8Array === 'function') {
      blob = new Blob([binary.toUint8Array()], {
        type: 'image/webp',
      })
    } else if (binary._byteString?.binaryString) {
      const uint8Array = Uint8Array.from(
        binary._byteString.binaryString,
        (char) => char.charCodeAt(0)
      )

      blob = new Blob([uint8Array], {
        type: 'image/webp',
      })
    }
    if (!blob) {
      setImageUrl('')
      return
    }
    const url = URL.createObjectURL(blob)
    setImageUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [target])

  const permission = async() => {
    Completion(MyID, target?.id, requestID)

  }

  const NotAllowed = async() => {
    console.log('不許可')
  }

  return (
    <div className={styles.Row}>
      <IconArea>
        {imageUrl && (
          <img
            className={styles.Img}
            src={imageUrl}
            width={170}
            height={170}
          />
        )}
      </IconArea>
      <div className={styles.datas}>
        <div>
          <MessageArea>
            {target?.comment}
          </MessageArea>
        </div>
        <div>
          <InputArea>
            <div className={styles.Maindata}>
              <div className={styles.search}>
                {target?.searchID ?? ''}
              </div>
              <div className={styles.Display}>
                {target?.displayName ?? ''}
              </div>
            </div>
          </InputArea>
        </div>
      </div>
      <div className={styles.ButtonArea}>
        {/* <CostomButton
          buttonName='許可'
          action={permission}
        />
        <CostomButton
          buttonName='不許可'
          action={NotAllowed}
        /> */}
      </div>

    </div>
  )
}