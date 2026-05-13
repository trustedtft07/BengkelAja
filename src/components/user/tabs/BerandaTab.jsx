import { useApp } from '../../../context/AppContext'
import Badge from '../../ui/Badge'

export default function BerandaTab({ onSwitchTab }) {
  const { userBooks } = useApp()
  const total    = userBooks.length
  const confirmed = userBooks.filter(b => b.status === 'Dikonfirmasi').length
  const waiting   = userBooks.filter(b => b.status === 'Menunggu').length
  const recent    = userBooks.slice(0, 5)

  return (
    <div className="fade-in">
      {/* Stats */}
      <div className="stats-row" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        {[['📋','Total Booking',total],['✅','Dikonfirmasi',confirmed],['⏳','Menunggu',waiting]].map(([ico,lbl,val]) => (
          <div key={lbl} className="stat-card">
            <div style={{ fontSize:24, marginBottom:8 }}>{ico}</div>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--text-light)', textTransform:'uppercase', letterSpacing:'.4px', marginBottom:3 }}>{lbl}</div>
            <div style={{ fontSize:24, fontWeight:900 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Category cards */}
      <div className="kat-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
        <div className="kat-card" onClick={() => onSwitchTab('layanan')}>
          <div style={{ width:48, height:48, borderRadius:12, background:'#e0f2fe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>⚙️</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800 }}>Booking Servis</div>
            <div style={{ fontSize:12, color:'var(--text-light)', marginTop:2 }}>Ganti Oli, Tune Up, AC, dll</div>
          </div>
        </div>
        <div className="kat-card" onClick={() => onSwitchTab('panggil')}>
          <div style={{ width:48, height:48, borderRadius:12, background:'#fff0ec', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>📞</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800 }}>Darurat</div>
            <div style={{ fontSize:12, color:'var(--text-light)', marginTop:2 }}>Panggil mekanik ke lokasi</div>
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <span style={{ fontSize:15, fontWeight:800 }}>Booking Terakhir</span>
        {total > 0 && <span style={{ fontSize:11, color:'var(--text-light)', fontWeight:600 }}>({total} total)</span>}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {recent.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <span style={{ fontSize:40, display:'block', marginBottom:12 }}>📋</span>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--text-light)' }}>Belum ada riwayat booking</p>
          </div>
        ) : recent.map(b => (
          <div key={b.id} className="booking-card">
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:'#fff0ec', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{b.icon || '📋'}</div>
              <div style={{ fontSize:14, fontWeight:800, flex:1 }}>{b.nama}</div>
              <Badge status={b.status} />
            </div>
            <div style={{ fontSize:12, color:'var(--text-light)' }}>Tanggal: {b.tanggal || '—'}</div>
            <div style={{ fontSize:12, color:'var(--text-light)' }}>Harga: {b.harga}</div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div style={{ background:'linear-gradient(135deg,#eff6ff,#f0eeff)', borderRadius:'var(--radius)', padding:16, borderLeft:'4px solid var(--blue)', marginTop:20 }}>
        <div style={{ fontSize:13, fontWeight:800, color:'var(--blue)', marginBottom:5 }}>⚠️ Tips Darurat</div>
        <div style={{ fontSize:13, color:'#334155', lineHeight:1.7 }}>Jika mengalami kendala di jalan, nyalakan lampu hazard dan pinggirkan kendaraan ke tempat aman sebelum memanggil bantuan. Bengkel Aja siap membantu 24 jam!</div>
      </div>
    </div>
  )
}
