import { useState } from 'react'
import { resetPassword } from '~/lib/LoginLogics'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await resetPassword(email)

    if (!result.ok) {
      alert(`送信失敗: ${result.code}`)
      return
    }

    alert('パスワード再設定メールを送信しました')
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
      />
      <Button
        type="submit"
        variant="contained"
      >
        再設定メールを送る
      </Button>
    </form>
  )
}