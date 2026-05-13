import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function AdminLoginPage() {
  const { doLogin, doAdminRegister, setPage } = useApp()
  const [lEmail, setLEmail] = useState('')
  const [lPass, setLPass]   = useState('')
  const [showPw, setShowPw] = useState(false)
  const [rF, setRF] = useState({ nama:'', email:'', pass:'', code:'' })
  const [err, setErr] = useState('')
  const [ok, setOk]   = useState('')

  const setR = k => e => setRF(p => ({ ...p, [k]: e.target.value }))

  const login = async () => {
    setErr(''); setOk('')
    if (!lEmail || !lPass) { setErr('Email dan password wajib diisi.'); return }
    try { await doLogin(lEmail, lPass) }
    catch (e) { setErr(e.message) }
  }

  const register = async () => {
    setErr(''); setOk('')
    if (!rF.nama || !rF.email || !rF.pass || !rF.code) { setErr('Semua kolom pendaftaran wajib diisi.'); return }
    if (rF.pass.length < 6) { setErr('Password minimal 6 karakter.'); return }
    try {
      await doAdminRegister(rF)
      setOk('✓ Akun admin berhasil dibuat!')
      setRF({ nama:'', email:'', pass:'', code:'' })
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <span style={{ fontSize:42, display:'block', marginBottom:8 }}>🛠️</span>
          <div style={{ fontSize:22, fontWeight:900, color:'#e67e22' }}>Admin Panel</div>
          <div style={{ fontSize:13, color:'var(--text-light)', marginTop:3 }}>Bengkel Aja — Akses Khusus Admin</div>
        </div>

        {err && <div className="msg msg-err show">{err}</div>}
        {ok  && <div className="msg msg-ok show">{ok}</div>}

        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Email Admin</label>
          <div className="input-icon-wrap">
            <span className="inp-ico">✉️</span>
            <input type="email" placeholder="admin@bengkelaja.com" value={lEmail} onChange={e => setLEmail(e.target.value)} />
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Password</label>
          <div className="input-icon-wrap">
            <span className="inp-ico">🔒</span>
            <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={lPass} onChange={e => setLPass(e.target.value)} />
            <button className="eye-btn" type="button" onClick={() => setShowPw(p => !p)}>{showPw ? '🙈' : '👁'}</button>
          </div>
        </div>
        <button className="btn" style={{ background:'#e67e22', color:'#fff', marginBottom:12 }} onClick={login}>
          Masuk sebagai Admin
        </button>

        <div className="auth-divider">atau</div>

        <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>Buat Akun Admin Baru</div>
        <div className="form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:10 }}>
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Nama</label>
            <input className="input-plain" type="text" placeholder="Nama admin" value={rF.nama} onChange={setR('nama')} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Email</label>
            <input className="input-plain" type="email" placeholder="Email" value={rF.email} onChange={setR('email')} />
          </div>
        </div>
        <div className="form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:10 }}>
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Password</label>
            <input className="input-plain" type="password" placeholder="Min. 6 karakter" value={rF.pass} onChange={setR('pass')} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Kode Admin</label>
            <input className="input-plain" type="text" placeholder="Kode rahasia admin" value={rF.code} onChange={setR('code')} />
          </div>
        </div>
        <button className="btn btn-outline" style={{ marginBottom:14 }} onClick={register}>Daftar sebagai Admin</button>
        <div style={{ textAlign:'center', fontSize:12, color:'var(--text-light)' }}>
          <em>Kode admin diperlukan untuk membuat akun admin baru</em>
        </div>
        <div style={{ textAlign:'center', marginTop:16 }}>
          <button className="link" onClick={() => setPage('login')}>← Kembali ke login user</button>
        </div>
      </div>
    </div>
  )
}
