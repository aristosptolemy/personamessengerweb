import styles from './Style.module.css'
import { useLogic } from './useLogic'


import TitleArea from '~/comp/TitleArea/TitleArea'
import InputArea from '~/comp/InputArea/InputArea'
import CostomButton from '~/comp/CostomButton/Button'


export default function RoomCreate() {
  
  const {
    register,
    handleSubmit,
    onSubmit
  } = useLogic()

  return (
    <div className={styles.MainBG}>
      <div className={styles.TitleArea}>
        <TitleArea>
           CreateRoom
        </TitleArea>
      </div>

      <div className={styles.InputArea}>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.FormArea}>
            <div>
              <InputArea>
                <input
                  className={styles.LoginInput}
                  {...register('roomName')}
                  placeholder='ルーム名'
                />
              </InputArea>
            </div>

            <div>
              <InputArea>
                <input
                  className={styles.LoginInput}
                  {...register('roomID', {
                    required: 'ルームIDを入力してください',
                    minLength: {
                      value: 3,
                      message: 'ルームIDは3文字以上で入力してください'
                    },
                    maxLength: {
                      value: 20,
                      message: 'ルームIDは20文字以内で入力してください'
                    },
                    pattern: {
                      value: /^[0-9a-z_]+$/,
                      message: 'ルームIDは半角英数字と_のみで入力してください'
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value
                        .toLowerCase()
                        .replace(/[^0-9a-z_]/g, '')
                        .slice(0, 20)
                    }
                  })}
                  maxLength={20}
                  placeholder="例：aristos_123"
                />
              </InputArea>
            </div>

            <div className={styles.ButtonArea}>
              <CostomButton
                buttonName='作成'
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}