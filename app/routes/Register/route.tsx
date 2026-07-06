import { useState, type ChangeEvent } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { register } from '~/lib/LoginLogics'
import { Link } from "react-router"
import toast, { Toaster } from 'react-hot-toast'
import styles from './register.module.css'

const Success = '確認メールを送信しました。届かない場合は迷惑メールフォルダも確認してください。'

export default function Register() {
  const [email, setEmail] = useState('')
  const [passP, setPassP] = useState('')
  const [passS, setPassS] = useState('')

  const handleEmailchange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handlePassPchange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassP(event.target.value)
  }

  const handlePassSchange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassS(event.target.value)
  }

  const AccountRegister = async() => {

    if (email == '' || passP == '' || passS == '') {
      toast.error('メールアドレス、もしくはパスワードが入力されていません')
      return
    } else if (passP !== passS) {
      toast.error('パスワードが一致しません')
      return
    }

    const result = await register(email, passP)

    if (!result.ok) {
      toast.error(`登録失敗: ${result.code}`)
      return
    }
  
    toast.success(Success)

  }

  return (
    <div className={styles.Main}>
      <Toaster />
      <div className={styles.Borders}>
        <div className={styles.MainBG}>
          <div className={styles.Title}>新規登録</div>
          <div className={styles.inputArea}>
            <div className={styles.emailArea}>
              <input
                className={styles.LoginInput}
                value={email}
                onChange={handleEmailchange}
                type="email"
                placeholder='メールアドレス'
              />
            </div>
            <div className={styles.passwordArea}>
              <div className={styles.passwordPrimaly}>
                <input
                  value={passP}
                  onChange={handlePassPchange}
                  type="password"
                  className={styles.LoginInput}
                  placeholder='パスワード'
                />
              </div>
              <div className={styles.passwordSecondary}>
                <input
                  value={passS}
                  onChange={handlePassSchange}
                  type="password"
                  className={styles.LoginInput}
                  placeholder='確認用パスワード'
                />
                
              </div>
            </div>
          </div>
          <div>
            <div className={styles.Button}>
              <button
                onClick={AccountRegister}
              >
                登録
              </button>
            </div>
            {/* <Button
              variant='contained'
              onClick={AccountRegister}
              size='large'
            >
              登録
            </Button> */}
          </div>
          <div>
            <Link to='/login'>ログイン</Link>
          </div>
        </div>  
      </div>
    </div>
  )
}