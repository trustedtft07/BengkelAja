import { useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function RegisterPage() {
  const { doRegister, setPage } = useApp()
  const [f, setF] = useState({ nama:'', username:'', email:'', telp:'', gender:'', alamat:'', pass:'', confirm:'' })
  const [err, setErr] = useState('')
  const [ok, setOk]   = useState('')

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    setErr(''); setOk('')
    if (!f.nama || !f.username || !f.email || !f.pass || !f.confirm) { setErr('Semua kolom wajib diisi.'); return }
    if (f.pass.length < 6) { setErr('Password minimal 6 karakter.'); return }
    if (f.pass !== f.confirm) { setErr('Konfirmasi password tidak cocok.'); return }
    try {
      await doRegister(f)
      setOk('✓ Akun berhasil dibuat! Silakan login.')
      setF({ nama:'', username:'', email:'', telp:'', gender:'', alamat:'', pass:'', confirm:'' })
    } catch (e) { setErr(e.message) }
  }

  const inp = (label, key, type='text', placeholder='') => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>{label}</label>
      <input className="input-plain" type={type} placeholder={placeholder} value={f[key]} onChange={set(key)} />
    </div>
  )

  return (
    <div className="auth-bg">
      <div className="auth-card wide fade-in">
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <span style={{ fontSize:42, display:'block', marginBottom:8 }}>🔧</span>
          <div style={{ fontSize:22, fontWeight:900, color:'var(--purple)' }}>Bengkel Aja</div>
        </div>
        <div style={{ fontSize:18, fontWeight:800, marginBottom:18 }}>Buat Akun Baru</div>

        {err && <div className="msg msg-err show">{err}</div>}
        {ok  && <div className="msg msg-ok show">{ok}</div>}

        <div className="form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {inp('Nama Lengkap','nama','text','Nama lengkap')}
          {inp('Username','username','text','Username unik')}
        </div>
        {inp('Email','email','email','email@contoh.com')}
        <div className="form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {inp('Nomor Telepon','telp','tel','08xxxxxxxxxx')}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Jenis Kelamin</label>
            <select className="input-plain" value={f.gender} onChange={set('gender')}>
              <option value="">Pilih...</option>
              <option>Laki-Laki</option>
              <option>Perempuan</option>
            </select>
          </div>
        </div>
        {inp('Alamat / Kota','alamat','text','Kota / Kecamatan')}
        <div className="form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {inp('Password','pass','password','Min. 6 karakter')}
          {inp('Konfirmasi Password','confirm','password','Ulangi password')}
        </div>

        <button className="btn btn-purple" style={{ marginTop:4, marginBottom:12 }} onClick={submit}>Buat Akun</button>
        <div style={{ textAlign:'center', fontSize:13, color:'var(--text-light)' }}>
          Sudah punya akun?{' '}
          <button className="link" onClick={() => setPage('login')}>Masuk di sini</button>
        </div>
      </div>
    </div>
  )
}
