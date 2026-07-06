import styles from './Style.module.css'
import { useLogic } from './useLogic'

import TitleArea from '~/comp/TitleArea/TitleArea'
import InputArea from '~/comp/InputArea/InputArea'
import ChatMessageArea from '~/comp/ChatMessageArea/MessageArea'

import CostomButton from '~/comp/CostomButton/Button'


import UserRow from './userRow'


export default function Room() {

  const {
    messages,
    users,
    roomData,
    userData,
    roomName,
    sendText,
    setSendText,
    sendMessage,
    sortedMessages
  } = useLogic()

  const targetUser = (id: string) => {
    return users.find((row) => row.id == id)
  }
  const targetUserName = (id: string) => {
    const result = users.find((row) => row.id == id)
    return result?.displayName ?? ''
  }

  return (
    <div className={styles.MainBG}>
      <div className={styles.TitleArea}>
        <TitleArea>
          {roomName}
        </TitleArea>
      </div>
      <div className={styles.MessageArea}>
        {sortedMessages.map((row) => (
          <div
            key={row.id}
            className={`${styles.Row} ${row.sendID === userData.id ? styles.Mine : styles.Other}`}
          >
            {row.sendID !== userData.id && (
              <UserRow
                target={targetUser(row.sendID)}
              />
            )}
            <div className={styles.nameMessage}>
              {row.sendID !== userData.id && (
                <div className={styles.Name}>
                  {targetUserName(row.sendID)}
                </div>
              )}
              <div>
                <ChatMessageArea isMine={row.sendID === userData.id}>
                  {row.message}
                </ChatMessageArea>
              </div>
            </div>
          </div>
        ))}
        
      </div>
      <div className={styles.inputArea}>
        <InputArea>
          <input
            placeholder='message...'
            value={sendText}
            onChange={
              (e) => setSendText(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return
              if (e.key === 'Enter') {
                e.preventDefault()
                if (!sendText.trim()) return
                sendMessage()
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




