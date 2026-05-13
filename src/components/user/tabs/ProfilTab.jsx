import { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import UbahPassModal from '../../modals/UbahPassModal'

export default function ProfilTab() {
  const { CU, UP, saveProfile, showToast } = useApp()
  const [editMode, setEditMode] = useState(false)
  const [f, setF] = useState({})
  const [err, setErr] = useState('')
  const [ok, setOk]   = useState('')
  const [showPass, setShowPass] = useState(false)

  const startEdit = () => {
    setF({ nama: UP?.nama || '', telp: UP?.telp || '', gender: UP?.gender || '', alamat: UP?.alamat || '' })
    setErr(''); setOk('')
    setEditMode(true)
  }

  const cancelEdit = () => setEditMode(false)

  const saveEdit = async () => {
    setErr(''); setOk('')
    if (!f.nama) { setErr('Nama wajib diisi.'); return }
    try {
      await saveProfile({ nama: f.nama, telp: f.telp, gender: f.gender, alamat: f.alamat })
      setOk('✓ Profil berhasil diperbarui!')
      setEditMode(false)
      showToast('Profil diperbarui ✓')
    } catch (e) { setErr('Gagal: ' + e.message) }
  }

  const row = (ico, key, label, val) => (
    <div key={key} className="info-row">
      <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{ico}</span>
      <div>
        <div style={{ fontSize:10, color:'var(--text-light)', marginBottom:2, fontWeight:700, textTransform:'uppercase' }}>{label}</div>
        <div style={{ fontSize:13, fontWeight:700 }}>{val || '—'}</div>
      </div>
    </div>
  )

  return (
    <div className="fade-in">
      {showPass && <UbahPassModal onClose={() => setShowPass(false)} />}

      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:18 }} className="profil-layout-grid">
        {/* Left card */}
        <div>
          <div style={{ background:'#fff', borderRadius:'var(--radius)', padding:24, textAlign:'center', boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 12px' }}>👤</div>
            <div style={{ fontSize:18, fontWeight:900 }}>{UP?.nama || '—'}</div>
            <div style={{ fontSize:12, color:'var(--text-light)', marginTop:4, wordBreak:'break-all' }}>{CU?.email || '—'}</div>
          </div>
          <div style={{ background:'#fff', borderRadius:'var(--radius)', padding:20, boxShadow:'var(--shadow)', border:'1px solid var(--border)', marginTop:14 }}>
            <div style={{ fontSize:14, fontWeight:800, marginBottom:12 }}>Keamanan Akun</div>
            <div className="info-row">
              <span style={{ fontSize:16 }}>🔒</span>
              <div>
                <div style={{ fontSize:10, color:'var(--text-light)', fontWeight:700, textTransform:'uppercase' }}>Password</div>
                <div style={{ fontSize:13, fontWeight:700 }}>Lindungi akun Anda</div>
              </div>
            </div>
            <button className="btn btn-sm btn-blue" style={{ marginTop:10 }} onClick={() => setShowPass(true)}>Ubah Password</button>
          </div>
        </div>

        {/* Right info */}
        <div style={{ background:'#fff', borderRadius:'var(--radius)', padding:20, boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, paddingBottom:12, borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontSize:14, fontWeight:800 }}>Informasi Pribadi</div>
            {!editMode
              ? <button className="btn btn-sm btn-purple" onClick={startEdit}>✏️ Edit</button>
              : <button className="btn btn-sm btn-outline" onClick={cancelEdit}>✕ Batal</button>
            }
          </div>

          {!editMode ? (
            <>
              {row('👤','nama','Nama Lengkap', UP?.nama)}
              {row('✉️','email','Email', CU?.email)}
              {row('📞','telp','Nomor Telepon', UP?.telp)}
              {row('🧑','gender','Jenis Kelamin', UP?.gender)}
              {row('📍','alamat','Alamat', UP?.alamat)}
            </>
          ) : (
            <>
              {err && <div className="msg msg-err show">{err}</div>}
              {ok  && <div className="msg msg-ok show">{ok}</div>}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Nama Lengkap</label>
                  <input className="input-plain" value={f.nama} onChange={e => setF(p => ({ ...p, nama: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Nomor Telepon</label>
                  <input className="input-plain" type="tel" value={f.telp} onChange={e => setF(p => ({ ...p, telp: e.target.value }))} />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Jenis Kelamin</label>
                  <select className="input-plain" value={f.gender} onChange={e => setF(p => ({ ...p, gender: e.target.value }))}>
                    <option value="">Pilih...</option>
                    <option>Laki-Laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Alamat</label>
                  <input className="input-plain" value={f.alamat} onChange={e => setF(p => ({ ...p, alamat: e.target.value }))} />
                </div>
              </div>
              <button className="btn btn-purple" onClick={saveEdit}>Simpan Perubahan</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
