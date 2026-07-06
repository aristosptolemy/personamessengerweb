import styles from './Style.module.css'
import { useLogic } from './useLogic'

import IconArea from '@comp/Icon/IconArea'
import InputArea from '@comp/InputArea/InputArea'
import TitleArea from '@comp/TitleArea/TitleArea'


import CostomButton from '@comp/CostomButton/Button'



export default function UserSetting() {
  const {
    register,
    handleSubmit,
    getRootProps,
    getInputProps,
    isDragActive,
    previewUrl,
    FileUIDisplay,
    onSubmit
  } = useLogic()


  return (
    <div className={styles.BG}>
      <div className={styles.TitleArea}>
        <TitleArea>
          プロフィール
        </TitleArea>
      </div>

      <IconArea>
        <div className={styles.FaceImg}>
          <div
            {...getRootProps()}
            className={styles.DropArea}
          >
            <input {...getInputProps()} />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="ユーザー画像"
                className={styles.PreviewImg}
                width={170}
                height={170}
              />
            ) : (
              <p>{isDragActive ? 'ここに離す' : '画像を選択'}</p>
            )}
          </div>
        </div>            
      </IconArea>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.FormArea}>
          <div>
            <InputArea>
              <input
                className={styles.LoginInput}
                {...register('displayName')}
                placeholder='相手に見せる名前'
              />
            </InputArea>
          </div>

          <div>
            <InputArea>
              <input
                className={styles.LoginInput}
                {...register('searchID', {
                  required: 'ユーザーIDを入力してください',
                  minLength: {
                    value: 3,
                    message: 'ユーザーIDは3文字以上で入力してください'
                  },
                  maxLength: {
                    value: 20,
                    message: 'ユーザーIDは20文字以内で入力してください'
                  },
                  pattern: {
                    value: /^[0-9a-z_]+$/,
                    message: 'ユーザーIDは半角英数字と_のみで入力してください'
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

          <div>
            <InputArea>
              <textarea
                className={styles.LoginInput}
                {...register('comment')}
                placeholder='紹介コメント'
                rows={4}
              />
            </InputArea>
          </div>

          <div className={styles.ButtonArea}>
            <CostomButton
              buttonName='変更'
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  )
}