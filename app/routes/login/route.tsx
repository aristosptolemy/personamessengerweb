import { useState, type ChangeEvent, type SubmitEvent } from 'react'

import { Link } from "react-router"
import { login } from '~/lib/LoginLogics'
import toast from 'react-hot-toast'

import { useNavigate } from 'react-router'

import { useGroup } from '@providers/GroupProvider'

import styles from './login.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  const { setUserId } = useGroup()

  const navigate = useNavigate()

  const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handlePass = (event: ChangeEvent<HTMLInputElement>) => {
    setPass(event.target.value)
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
 
    if (email == '' || pass == '') {
      toast.error('メールアドレス、もしくはパスワードが入力されていません')
      return
    }
    const result = await login(email, pass)

    const emailVerifiedChack = result.ok
    if (emailVerifiedChack) {
      const data = {
        id: result.user.uid,
        displayName: result?.user.displayName ?? '',
      }
      setUserId(data.id)
      localStorage.setItem('userData', JSON.stringify(data))
      navigate('/')
      return
    }

    toast.error('ログインに失敗しました')
    toast.error('メールアドレス、またはパスワードが間違っている可能性があります')

  }






  return (
    <div className={styles.Main}>
      <div className={styles.Borders}>
        <div
          className={styles.MainBG}
        >
          <div className={styles.LoginTitle}>ログイン</div>
          <form
            onSubmit={handleSubmit}
            className={styles.Form}
          >
            <div
              className={styles.inputArea}
            >
              <input
                className={styles.LoginInput}
                value={email}
                onChange={handleEmail}
                type="email"
                placeholder="メールアドレス"
              />
              <input
                className={styles.LoginInput}
                value={pass}
                onChange={handlePass}
                type="password"
                placeholder='パスワード'
              />
              {/* <TextField
                fullWidth
                value={email}
                onChange={handleEmail}
                type="email"
                label="メールアドレス"
                className={styles.textField}
              /> */}
              {/* <TextField
                fullWidth
                value={pass}
                onChange={handlePass}
                className={styles.textField}
                type="password"
                label="パスワード"
              /> */}
            </div>
            <div>
              {/* <Button
                variant='contained'
                type="submit"
                size="large"
                className={styles.LoginButton}
              >
                ログイン
              </Button> */}
              <div className={styles.Button}>
                <button
                  type="submit"
                >
                  ログイン
                </button>
              </div>
              
            </div>
            <div
              className={styles.helpArea}
            >
              <div>
                <Link to='/Register' className={styles.Register}>アカウント新規登録</Link>
              </div>
              <div>
                <Link to='/ResetPassword' className={styles.Reset}>パスワード再設定</Link>
              </div>
            </div>
          </form>
        </div>        
      </div>
    </div>
  )
}