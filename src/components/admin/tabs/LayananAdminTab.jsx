import { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import Modal from '../../ui/Modal'
import ConfirmDialog from '../../ui/ConfirmDialog'

const KATEGORI = ['Servis Rutin','Servis Umum','Body Repair','Kelistrikan','AC','Darurat']

function LayananModal({ editData, onClose }) {
  const { saveLayanan } = useApp()
  const [f, setF] = useState(editData ? {
    nama: editData.nama || '', kategori: editData.kategori || '', harga: editData.harga || '',
    estimasi: editData.estimasi || '', desc: editData.desc || '',
  } : { nama:'', kategori:'', harga:'', estimasi:'', desc:'' })
  const [err, setErr] = useState('')
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    setErr('')
    if (!f.nama)     { setErr('Nama layanan wajib diisi.'); return }
    if (!f.harga)    { setErr('Range harga wajib diisi.'); return }
    if (!f.estimasi) { setErr('Estimasi waktu wajib diisi.'); return }
    const tags = f.kategori ? [f.kategori] : (editData?.tags || [])
    const data = { nama:f.nama, kategori:f.kategori, icon: editData?.icon || '🔧', desc:f.desc, harga:f.harga, hargaVal: editData?.hargaVal || 0, estimasi:f.estimasi, tags }
    try { await saveLayanan(data, editData?.id || null); onClose() }
    catch (e) { setErr('Gagal menyimpan: ' + e.message) }
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ fontSize:17, fontWeight:900, marginBottom:4 }}>{editData ? 'Edit Layanan' : 'Tambah Layanan'}</div>
      <div style={{ fontSize:13, color:'var(--text-mid)', marginBottom:18 }}>{editData ? 'Perbarui informasi layanan' : 'Tambahkan layanan baru'}</div>
      {err && <div className="msg msg-err show">{err}</div>}
      {[['Nama Layanan','nama','text','Contoh: Ganti Oli Mesin'],['Range Harga','harga','text','Rp 50.000 - Rp 150.000'],['Estimasi Waktu','estimasi','text','30 - 45 menit']].map(([lbl,k,t,ph]) => (
        <div key={k} style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>{lbl}</label>
          <input className="input-plain" type={t} placeholder={ph} value={f[k]} onChange={set(k)} />
        </div>
      ))}
      <div style={{ marginBottom:14 }}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Kategori</label>
        <select className="input-plain" value={f.kategori} onChange={set('kategori')}>
          <option value="">Pilih kategori</option>
          {KATEGORI.map(k => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div style={{ marginBottom:14 }}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Deskripsi</label>
        <textarea className="input-plain" rows="3" placeholder="Deskripsi singkat layanan..." value={f.desc} onChange={set('desc')} />
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
        <button className="btn btn-outline" style={{ width:'auto', padding:'10px 24px' }} onClick={onClose}>Batal</button>
        <button className="btn btn-dark"    style={{ width:'auto', padding:'10px 24px' }} onClick={submit}>{editData ? 'Perbarui' : 'Tambah'}</button>
      </div>
    </Modal>
  )
}

export default function LayananAdminTab() {
  const { allLayanan, deleteLayanan } = useApp()
  const [modal, setModal]   = useState(null) // null | 'add' | layanan object
  const [delId, setDelId]   = useState(null)

  return (
    <div>
      {modal && <LayananModal editData={modal === 'add' ? null : modal} onClose={() => setModal(null)} />}
      {delId && (
        <ConfirmDialog
          title="Hapus layanan ini?"
          msg="Layanan yang dihapus tidak bisa dikembalikan."
          okLabel="Hapus" okClass="btn-red"
          onOk={async () => { await deleteLayanan(delId); setDelId(null) }}
          onCancel={() => setDelId(null)}
        />
      )}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
        <div style={{ fontSize:17, fontWeight:900 }}>Daftar Layanan</div>
        <button className="btn-tambah" onClick={() => setModal('add')}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Tambah Layanan
        </button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {allLayanan.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <span style={{ fontSize:40, display:'block', marginBottom:12 }}>🔧</span>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--text-light)' }}>Belum ada layanan.</p>
          </div>
        ) : allLayanan.map(l => (
          <div key={l.id} className="admin-lay-card">
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <span style={{ fontSize:16, fontWeight:800 }}>{l.nama}</span>
                <span style={{ display:'inline-flex', padding:'3px 11px', borderRadius:20, background:'var(--gray-light)', color:'var(--text-mid)', fontSize:12, fontWeight:700 }}>{l.kategori || (l.tags?.[0]) || 'Umum'}</span>
              </div>
              <div style={{ fontSize:14, color:'var(--text-mid)', marginBottom:5 }}>{l.desc}</div>
              <div style={{ fontSize:14, color:'var(--text-mid)', marginBottom:5 }}>Harga: <strong style={{ color:'var(--text)' }}>{l.harga}</strong></div>
              <div style={{ fontSize:14, color:'var(--text-mid)' }}>Estimasi: <strong style={{ color:'var(--text)' }}>{l.estimasi}</strong></div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, alignSelf:'flex-start', marginTop:4 }}>
              <button className="icon-btn" onClick={() => setModal(l)} title="Edit">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button className="icon-btn del" onClick={() => setDelId(l.id)} title="Hapus">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
