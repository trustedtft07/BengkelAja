import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function LoginPage() {
  const { doLogin, setPage } = useApp()
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr]       = useState('')

  const submit = async () => {
    setErr('')
    if (!email || !pass) { setErr('Email dan password wajib diisi.'); return }
    try { await doLogin(email, pass) }
    catch (e) { setErr(e.message) }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 42, display: 'block', marginBottom: 8 }}>🔧</span>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--purple)' }}>Bengkel Aja</div>
          <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 3 }}>Solusi cepat untuk kendala kendaraan Anda</div>
        </div>

        {err && <div className="msg msg-err show">{err}</div>}

        <div className="fg" style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Email</label>
          <div className="input-icon-wrap">
            <span className="inp-ico">✉️</span>
            <input type="email" placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
        </div>

        <div className="fg" style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Password</label>
          <div className="input-icon-wrap">
            <span className="inp-ico">🔒</span>
            <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={pass}
              onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
            <button className="eye-btn" type="button" onClick={() => setShowPw(p => !p)}>{showPw ? '🙈' : '👁'}</button>
          </div>
        </div>

        <button className="btn btn-purple" onClick={submit}>Masuk</button>

        <div className="auth-divider">atau</div>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text-light)' }}>
          Belum punya akun?{' '}
          <button className="link" onClick={() => setPage('register')}>Daftar sekarang</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button onClick={() => setPage('admin-login')}
            style={{ background: 'none', border: 'none', color: 'var(--text-mid)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
            🔐 Login sebagai Admin
          </button>
        </div>
      </div>
    </div>
  )
}
