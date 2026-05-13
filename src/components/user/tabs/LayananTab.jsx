import { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import BookingOkModal from '../../modals/BookingOkModal'

export default function LayananTab({ onSwitchTab }) {
  const { allLayanan, doBooking } = useApp()
  const [q, setQ]           = useState('')
  const [showOk, setShowOk] = useState(false)

  const filtered = q.trim()
    ? allLayanan.filter(l =>
        l.nama.toLowerCase().includes(q.toLowerCase()) ||
        l.desc.toLowerCase().includes(q.toLowerCase()) ||
        (l.tags || []).some(t => t.toLowerCase().includes(q.toLowerCase()))
      )
    : allLayanan

  const handleBook = async (id) => {
    await doBooking(id)
    setShowOk(true)
  }

  return (
    <div className="fade-in">
      {showOk && <BookingOkModal onClose={() => setShowOk(false)} onLihat={() => onSwitchTab('riwayat')} />}

      {/* Search hero */}
      <div style={{ background:'linear-gradient(135deg,var(--purple),#7c3aed)', borderRadius:'var(--radius)', padding:20, marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:12 }}>🔍 Cari Layanan Bengkel</div>
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontSize:16, pointerEvents:'none' }}>🔍</span>
          <input className="sh-search" placeholder="Cari layanan (ganti oli, AC, ban, rem...)"
            value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <span style={{ fontSize:15, fontWeight:800 }}>{q ? 'Hasil Pencarian' : 'Semua Layanan'}</span>
        <span style={{ fontSize:11, color:'var(--text-light)', fontWeight:600 }}>({filtered.length})</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-light)', fontWeight:700 }}>🔍<br/><br/>Layanan tidak ditemukan.</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
          {filtered.map(l => (
            <div key={l.id} className="lay-card">
              <div style={{ display:'flex', gap:12, padding:14 }}>
                <div style={{ width:62, height:72, borderRadius:10, background:'linear-gradient(135deg,#ffb3a0,#ff7b6b)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>{l.icon || '🔧'}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:800, marginBottom:3 }}>{l.nama}</div>
                  <div style={{ fontSize:11, color:'var(--text-mid)', marginBottom:7, lineHeight:1.5 }}>{l.desc}</div>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:6 }}>
                    {(l.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--text-mid)' }}>{l.harga} · {l.estimasi}</div>
                </div>
              </div>
              <div style={{ padding:'0 14px 14px' }}>
                <button className="btn-book" onClick={() => handleBook(l.id)}>Booking</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
