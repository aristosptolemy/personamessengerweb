import styles from './Style.module.css'
import { useLogic } from './useLogic'

import TitleArea from '~/comp/TitleArea/TitleArea'
import InputArea from '~/comp/InputArea/InputArea'
import ChatMessageArea from '~/comp/ChatMessageArea/MessageArea'

import CostomButton from '~/comp/CostomButton/Button'


import UserRow from './userRow'


export default function Room() {
  const {
    users,
    userData,
    roomName,
    sendText,
    setSendText,
    sendMessage,
    sortedMessages
  } = useLogic()

  const myId = userData?.id

  const targetUser = (id: string) => {
    return users.find((row) => row?.id === id)
  }

  const targetUserName = (id: string) => {
    const result = users.find((row) => row?.id === id)
    return result?.displayName ?? ''
  }

  if (!myId) {
    return null
  }

  return (
    <div className={styles.MainBG}>
      <div className={styles.TitleArea}>
        <TitleArea>
          {roomName}
        </TitleArea>
      </div>

      <div className={styles.MessageArea}>
        {sortedMessages.map((row) => {
          const isMine = row.sendID === myId
          const sender = targetUser(row.sendID)

          return (
            <div
              key={row.id}
              className={`${styles.Row} ${isMine ? styles.Mine : styles.Other}`}
            >
              {!isMine && (
                <UserRow
                  target={sender}
                />
              )}

              <div className={styles.nameMessage}>
                {!isMine && (
                  <div className={styles.Name}>
                    {targetUserName(row.sendID)}
                  </div>
                )}

                <div>
                  <ChatMessageArea isMine={isMine}>
                    {row.message}
                  </ChatMessageArea>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.inputArea}>
        <InputArea>
          <input
            placeholder='message...'
            value={sendText}
            onChange={(e) => setSendText(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return

              if (e.key === 'Enter') {
                e.preventDefault()

                if (!sendText.trim()) return

                sendMessage()

                e.currentTarget.blur()
              }
            }}
          />
        </InputArea>

        <CostomButton
          buttonName='送信'
          action={sendMessage}
        />
      </div>
    </div>
  )
}