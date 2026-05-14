import { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import Modal from '../../ui/Modal'
import ConfirmDialog from '../../ui/ConfirmDialog'

const SPEK = ['Mekanik Umum','Spesialis Kelistrikan','Spesialis AC','Tambal Ban','Body & Cat','Tune Up & Karburator']

function MekanikModal({ editData, onClose }) {
  const { saveMekanik } = useApp()
  const [f, setF] = useState(editData ? {
    nama: editData.nama || '', spek: editData.spek || '', exp: editData.exp || '',
    rating: editData.rating || '', harga: editData.harga || '', waktu: editData.waktu || '',
  } : { nama:'', spek:'', exp:'', rating:'', harga:'', waktu:'' })
  const [err, setErr] = useState('')
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    setErr('')
    if (!f.nama) { setErr('Nama mekanik wajib diisi.'); return }
    if (!f.spek) { setErr('Spesialisasi wajib dipilih.'); return }
    const data = { nama:f.nama, spek:f.spek, exp:f.exp, rating:f.rating, harga:parseInt(f.harga)||0, waktu:f.waktu }
    try { await saveMekanik(data, editData?.id || null); onClose() }
    catch (e) { setErr('Gagal menyimpan: ' + e.message) }
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ fontSize:17, fontWeight:900, marginBottom:4 }}>{editData ? 'Edit Mekanik' : 'Tambah Mekanik'}</div>
      <div style={{ fontSize:13, color:'var(--text-mid)', marginBottom:18 }}>{editData ? 'Perbarui informasi mekanik' : 'Tambahkan mekanik baru'}</div>
      {err && <div className="msg msg-err show">{err}</div>}
      <div style={{ marginBottom:14 }}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Nama Mekanik</label>
        <input className="input-plain" placeholder="Nama lengkap mekanik" value={f.nama} onChange={set('nama')} />
      </div>
      <div style={{ marginBottom:14 }}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Spesialisasi</label>
        <select className="input-plain" value={f.spek} onChange={set('spek')}>
          <option value="">Pilih spesialisasi</option>
          {SPEK.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      {[['Rating (1–5)','rating','number','4.9'],['Harga Panggil (Rp)','harga','number','150000']].map(([lbl,k,t,ph]) => (
        <div key={k} style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>{lbl}</label>
          <input className="input-plain" type={t} placeholder={ph} value={f[k]} onChange={set(k)} />
        </div>
      ))}
      <div style={{ marginBottom:14 }}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Pengalaman</label>
        <div style={{ position:'relative' }}>
          <input
            className="input-plain"
            type="number"
            min="0"
            placeholder="Contoh: 8"
            value={f.exp.replace(/\s*tahun$/i, '')}
            onChange={e => setF(p => ({ ...p, exp: e.target.value ? e.target.value + ' tahun' : '' }))}
            style={{ paddingRight: 60 }}
          />
          <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', fontSize:13, fontWeight:700, color:'var(--text-light)', pointerEvents:'none' }}>tahun</span>
        </div>
      </div>
      <div style={{ marginBottom:14 }}>
        <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6 }}>Waktu Respons</label>
        <div style={{ position:'relative' }}>
          <input
            className="input-plain"
            type="number"
            min="0"
            placeholder="Contoh: 15"
            value={f.waktu.replace(/\s*menit$/i, '')}
            onChange={e => setF(p => ({ ...p, waktu: e.target.value ? e.target.value + ' menit' : '' }))}
            style={{ paddingRight: 60 }}
          />
          <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', fontSize:13, fontWeight:700, color:'var(--text-light)', pointerEvents:'none' }}>menit</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
        <button className="btn btn-outline" style={{ width:'auto', padding:'10px 24px' }} onClick={onClose}>Batal</button>
        <button className="btn btn-dark"    style={{ width:'auto', padding:'10px 24px' }} onClick={submit}>{editData ? 'Perbarui' : 'Tambah'}</button>
      </div>
    </Modal>
  )
}

export default function MekanikAdminTab() {
  const { allMekanik, deleteMekanik } = useApp()
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)

  return (
    <div>
      {modal && <MekanikModal editData={modal === 'add' ? null : modal} onClose={() => setModal(null)} />}
      {delId && (
        <ConfirmDialog
          title="Hapus mekanik ini?"
          msg="Data mekanik yang dihapus tidak bisa dikembalikan."
          okLabel="Hapus" okClass="btn-red"
          onOk={async () => { await deleteMekanik(delId); setDelId(null) }}
          onCancel={() => setDelId(null)}
        />
      )}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
        <div style={{ fontSize:17, fontWeight:900 }}>Daftar Mekanik</div>
        <button className="btn-tambah" onClick={() => setModal('add')}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Tambah Mekanik
        </button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {allMekanik.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <span style={{ fontSize:40, display:'block', marginBottom:12 }}>👷</span>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--text-light)' }}>Belum ada mekanik.</p>
          </div>
        ) : allMekanik.map(m => (
          <div key={m.id} className="admin-mek-card">
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <span style={{ fontSize:16, fontWeight:800 }}>{m.nama}</span>
                <span className="bdg-tersedia">Tersedia</span>
              </div>
              <div style={{ fontSize:14, color:'var(--text-mid)', marginBottom:5 }}>Spesialisasi: <strong style={{ color:'var(--text)' }}>{m.spek || '—'}</strong></div>
              <div style={{ fontSize:14, color:'var(--text-mid)', marginBottom:5 }}>Pengalaman: <strong style={{ color:'var(--text)' }}>{m.exp || '—'}</strong></div>
              <div style={{ fontSize:14, color:'var(--text-mid)', marginBottom:5 }}>Rating: <strong style={{ color:'var(--text)' }}>{m.rating || '—'}</strong> <span style={{ color:'#eab308' }}>★</span></div>
              <div style={{ fontSize:14, color:'var(--text-mid)', marginBottom:5 }}>Harga Panggil: <strong style={{ color:'var(--text)' }}>Rp {(m.harga || 0).toLocaleString('id-ID')}</strong></div>
              <div style={{ fontSize:14, color:'var(--text-mid)' }}>Waktu Respons: <strong style={{ color:'var(--text)' }}>{m.waktu || '—'}</strong></div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, alignSelf:'flex-start', marginTop:4 }}>
              <button className="icon-btn" onClick={() => setModal(m)} title="Edit">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button className="icon-btn del" onClick={() => setDelId(m.id)} title="Hapus">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
