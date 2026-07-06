import styles from './Style.module.css'

import TitleArea from '@comp/TitleArea/TitleArea'
import InputArea from '@comp/InputArea/InputArea'
import CostomButton from '@comp/CostomButton/Button'
import IconArea from '@comp/Icon/IconArea'
import DisplayArea from '@comp/DisplayName/DisplayName'
import Dialog from '@comp/CostomDialog/Dialog'

import { useLogic } from './useLogic'

export default function FriendSearch() {
  const {
    searchID,
    setSearchID,
    onSearch,
    friendUser,
    imageUrl,
    friendRequest,
    friendRequestOpen,
    setFriendRequestOpen,
    RequestSend,
    friendRequestCancel,
    requestMessage,
    setRequstMessage
  } = useLogic()

  return (
    <div className={styles.BG}>
      <div className={styles.TitleArea}>
        <TitleArea>
          User Search
        </TitleArea>
      </div>
      <div className={styles.searchArea}>
        <div>
          <InputArea>
            <input
              className={styles.LoginInput}
              placeholder='検索ID'
              value={searchID}
              onChange={
                (e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                  setSearchID(value)
                }
              }
              pattern="^[0-9A-Za-z]+$"
            />
          </InputArea>
        </div>
        <div>
          <CostomButton
            buttonName='検索'
            action={onSearch}
          />
        </div>
      </div>
      {friendUser?.id && (
        <div className={styles.result}>
          <div className={styles.Icon}>
            <IconArea>
              {imageUrl && (
                <img
                  className={styles.Img}
                  src={imageUrl}
                  width={160}
                  height={160}
                />
              )}
            </IconArea>
          </div>

          <div className={styles.displayName}>
            <DisplayArea>
              {friendUser.displayName}
            </DisplayArea>
            <div>
              <CostomButton
                buttonName='フレンド依頼'
                action={friendRequest}
              />
            </div>
          </div>
        </div>
      )}
      {friendRequestOpen && (
        <Dialog
          setFriendRequestOpen={setFriendRequestOpen}
        >
          <div className={styles.DialogMain}>
            <div className={styles.DialogTitle}>
              フレンド依頼を送信しますか？
            </div>
            <div>
              <InputArea>
                <textarea
                  className={styles.TextArea}
                  placeholder='メッセージを入力'
                  value={requestMessage}
                  rows={2}
                  onChange={
                    (e) => setRequstMessage(e.target.value)
                  }
                />
              </InputArea>
            </div>
            <div className={styles.DialogButtons}>
              <div>
                <CostomButton
                  buttonName='送信する'
                  action={RequestSend}
                />
              </div>
              <div>
                <CostomButton
                  buttonName='キャンセル'
                  action={friendRequestCancel}
                />
              </div>
              
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}




