import { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import BookingOkModal from '../../modals/BookingOkModal'

const MASALAH = ['🔧 Mogok Mesin','🔵 Ban Bocor','⚡ Aki / Starter','🌡️ Overheat','🛑 Masalah Rem','❓ Lainnya']
const MEKANIK_STATIC = [
  { nama:'Budiono Siregar', spek:'Tambal Ban',       exp:'8 Th', rating:'4.9', harga:150000, tiba:'15–20m', job:'500+' },
  { nama:'Ahmad Hidayat',   spek:'Mekanik Umum',     exp:'6 Th', rating:'4.7', harga:175000, tiba:'25–30m', job:'320+' },
  { nama:'Rizky Pratama',   spek:'AC & Listrik',     exp:'5 Th', rating:'4.8', harga:200000, tiba:'20–35m', job:'210+' },
]

export default function PanggilTab({ onSwitchTab }) {
  const { doPanggil } = useApp()
  const [sel, setSel]   = useState(null)
  const [showOk, setShowOk] = useState(false)

  const handlePanggil = async (nama, harga) => {
    await doPanggil(nama, harga)
    setShowOk(true)
  }

  return (
    <div className="fade-in">
      {showOk && <BookingOkModal onClose={() => setShowOk(false)} onLihat={() => onSwitchTab('riwayat')} />}

      <div style={{ background:'linear-gradient(135deg,var(--orange),#f7b733)', borderRadius:'var(--radius)', padding:20, marginBottom:20 }}>
        <div style={{ fontSize:19, fontWeight:900, color:'#fff', marginBottom:4 }}>🚨 Panggil Mekanik Darurat</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,.85)' }}>Bantuan cepat ke lokasi Anda — 24 jam</div>
      </div>

      <div style={{ fontSize:15, fontWeight:800, marginBottom:12 }}>Pilih jenis masalah:</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:9, marginBottom:20 }}>
        {MASALAH.map(m => (
          <button key={m} className={`masalah-btn${sel === m ? ' sel' : ''}`} onClick={() => setSel(m)}>{m}</button>
        ))}
      </div>

      <div style={{ fontSize:15, fontWeight:800, marginBottom:12 }}>Pilih Mekanik:</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:14 }}>
        {MEKANIK_STATIC.map(m => (
          <div key={m.nama} className="mek-card">
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ width:46, height:46, borderRadius:'50%', border:'2px solid var(--border)', background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>👷</div>
              <div>
                <div style={{ fontSize:14, fontWeight:800, marginBottom:3 }}>{m.nama}</div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                  {[m.spek, `⭐${m.exp}`, `★${m.rating}`].map(t => (
                    <span key={t} style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, background:'var(--gray-light)', color:'var(--text-mid)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:7, marginBottom:13, background:'var(--gray-light)', borderRadius:9, padding:10 }}>
              {[['Harga',`Rp${(m.harga/1000).toFixed(0)}rb`],['Tiba',m.tiba],['Job',m.job]].map(([lbl,val]) => (
                <div key={lbl}>
                  <div style={{ fontSize:9, color:'var(--text-light)', marginBottom:2 }}>{lbl}</div>
                  <div style={{ fontSize:12, fontWeight:800 }}>{val}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-orange" onClick={() => handlePanggil(m.nama, m.harga)}>📞 Panggil</button>
          </div>
        ))}
      </div>
    </div>
  )
}
