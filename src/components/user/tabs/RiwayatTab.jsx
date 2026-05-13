import { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import Badge from '../../ui/Badge'

export default function RiwayatTab() {
  const { userBooks } = useApp()
  const [q, setQ] = useState('')

  const filtered = q.trim()
    ? userBooks.filter(b => b.nama.toLowerCase().includes(q.toLowerCase()) || (b.tanggal || '').includes(q))
    : userBooks

  return (
    <div className="fade-in">
      <div style={{ marginBottom:16, position:'relative', display:'inline-flex' }}>
        <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'var(--text-light)', pointerEvents:'none' }}>🔍</span>
        <input className="search-input" placeholder="Cari riwayat booking..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 20px' }}>
          <span style={{ fontSize:40, display:'block', marginBottom:12 }}>🕐</span>
          <p style={{ fontSize:14, fontWeight:700, color:'var(--text-light)' }}>
            {userBooks.length ? 'Tidak ada hasil.' : 'Belum ada riwayat booking'}
          </p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
          {filtered.map(b => (
            <div key={b.id} className="rwyt-card">
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:7 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:'#fff0ec', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{b.icon || '📋'}</div>
                <div style={{ fontSize:13, fontWeight:800, flex:1 }}>{b.nama}</div>
                <Badge status={b.status} />
              </div>
              <div style={{ fontSize:11, color:'var(--text-light)' }}>{b.tanggal || '—'} · {b.harga}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
