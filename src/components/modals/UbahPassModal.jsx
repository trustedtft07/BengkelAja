import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal from '../ui/Modal'

export default function UbahPassModal({ onClose }) {
  const { doUbahPass, showToast } = useApp()
  const [f, setF] = useState({ old:'', new:'', cfm:'' })
  const [err, setErr] = useState('')
  const [ok, setOk]   = useState('')

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    setErr(''); setOk('')
    if (!f.old || !f.new || !f.cfm) { setErr('Semua kolom wajib diisi.'); return }
    if (f.new.length < 6) { setErr('Password baru minimal 6 karakter.'); return }
    if (f.new !== f.cfm) { setErr('Konfirmasi tidak cocok.'); return }
    try {
      await doUbahPass(f.old, f.new)
      setOk('✓ Password berhasil diperbarui!')
      setF({ old:'', new:'', cfm:'' })
      showToast('Password diperbarui ✓')
      setTimeout(onClose, 1400)
    } catch (e) { setErr(e.message) }
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ fontSize:17, fontWeight:900, marginBottom:4 }}>Ubah Password</div>
      <div style={{ fontSize:13, color:'var(--text-mid)', marginBottom:18 }}>Masukkan password lama dan password baru</div>
      {err && <div className="msg msg-err show">{err}</div>}
      {ok  && <div className="msg msg-ok show">{ok}</div>}
      {[['Password Lama','old','Password saat ini'],['Password Baru','new','Min. 6 karakter'],['Konfirmasi','cfm','Ulangi password baru']].map(([lbl,k,ph]) => (
        <div key={k} style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>{lbl}</label>
          <input className="input-plain" type="password" placeholder={ph} value={f[k]} onChange={set(k)} />
        </div>
      ))}
      <button className="btn btn-purple" onClick={submit}>Perbarui Password</button>
    </Modal>
  )
}
