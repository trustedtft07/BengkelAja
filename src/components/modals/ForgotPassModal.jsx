import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal from '../ui/Modal'

export default function ForgotPassModal({ onClose }) {
  const { doForgotPass } = useApp()
  const [email, setEmail] = useState('')
  const [err, setErr]     = useState('')
  const [ok, setOk]       = useState('')

  const submit = async () => {
    setErr(''); setOk('')
    if (!email) { setErr('Masukkan email Anda.'); return }
    try {
      await doForgotPass(email)
      setOk(`✓ Link reset password telah dikirim ke ${email}`)
    } catch (e) { setErr(e.message) }
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ fontSize:17, fontWeight:900, marginBottom:4 }}>Reset Password</div>
      <div style={{ fontSize:13, color:'var(--text-mid)', marginBottom:18 }}>Masukkan email Anda, kami akan kirim link reset password</div>
      {err && <div className="msg msg-err show">{err}</div>}
      {ok  && <div className="msg msg-ok show">{ok}</div>}
      <div style={{ marginBottom:14 }}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Email</label>
        <input className="input-plain" type="email" placeholder="email@contoh.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <button className="btn btn-purple" onClick={submit}>Kirim Link Reset</button>
    </Modal>
  )
}
