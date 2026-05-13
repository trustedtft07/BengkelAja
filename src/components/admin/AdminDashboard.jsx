import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import ConfirmDialog from '../ui/ConfirmDialog'
import Modal from '../ui/Modal'
import UbahPassModal from '../modals/UbahPassModal'
import BookingTab from './tabs/BookingTab'
import LayananAdminTab from './tabs/LayananAdminTab'
import MekanikAdminTab from './tabs/MekanikAdminTab'
import Badge from '../ui/Badge'

export default function AdminDashboard() {
  const { UP, CU, allBooks, doLogout } = useApp()
  const [tab, setTab]           = useState('booking')
  const [drawerOpen, setDrawer] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [showProfil, setShowProfil]       = useState(false)
  const [showRiwayat, setShowRiwayat]     = useState(false)
  const [showPass, setShowPass]           = useState(false)

  const myBooks = allBooks.filter(b => b.uid === CU?.uid)

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f0f2ff' }}>
      {confirmLogout && (
        <ConfirmDialog title="Keluar?" msg="Anda akan diarahkan ke halaman login."
          okLabel="Keluar" okClass="btn-red"
          onOk={() => { setConfirmLogout(false); doLogout() }}
          onCancel={() => setConfirmLogout(false)} />
      )}

      {showPass    && <UbahPassModal onClose={() => setShowPass(false)} />}

      {showProfil && (
        <Modal onClose={() => setShowProfil(false)}>
          <div style={{ fontSize:17, fontWeight:900, marginBottom:16 }}>Profil Admin</div>
          <div style={{ textAlign:'center', marginBottom:16 }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,var(--orange),#f7b733)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, margin:'0 auto 10px' }}>🛠️</div>
            <div style={{ fontSize:17, fontWeight:900 }}>{UP?.nama || '—'}</div>
            <div style={{ fontSize:13, color:'var(--text-light)' }}>{CU?.email || '—'}</div>
            <span className="badge bdg-admin" style={{ marginTop:6 }}>🛠️ Admin</span>
          </div>
          <div className="info-row"><span style={{ fontSize:16 }}>✉️</span><div><div style={{ fontSize:10, color:'var(--text-light)', fontWeight:700, textTransform:'uppercase' }}>Email</div><div style={{ fontSize:13, fontWeight:700 }}>{CU?.email || '—'}</div></div></div>
          <div className="info-row"><span style={{ fontSize:16 }}>👤</span><div><div style={{ fontSize:10, color:'var(--text-light)', fontWeight:700, textTransform:'uppercase' }}>Nama</div><div style={{ fontSize:13, fontWeight:700 }}>{UP?.nama || '—'}</div></div></div>
          <div style={{ marginTop:14 }}>
            <button className="btn btn-sm btn-blue" onClick={() => { setShowProfil(false); setShowPass(true) }}>Ubah Password</button>
          </div>
        </Modal>
      )}

      {showRiwayat && (
        <Modal onClose={() => setShowRiwayat(false)} wide>
          <div style={{ fontSize:17, fontWeight:900, marginBottom:4 }}>Riwayat Booking Saya</div>
          <div style={{ fontSize:13, color:'var(--text-mid)', marginBottom:18 }}>Booking yang pernah saya buat sebagai admin</div>
          {myBooks.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px 0' }}>
              <span style={{ fontSize:36, display:'block', marginBottom:10 }}>🕐</span>
              <p style={{ fontSize:14, fontWeight:700, color:'var(--text-light)' }}>Belum ada riwayat</p>
            </div>
          ) : myBooks.map(b => (
            <div key={b.id} className="booking-card" style={{ marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:'#fff0ec', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>{b.icon || '📋'}</div>
                <div style={{ fontSize:14, fontWeight:800, flex:1 }}>{b.nama}</div>
                <Badge status={b.status} />
              </div>
              <div style={{ fontSize:12, color:'var(--text-light)' }}>{b.tanggal || '—'} · {b.harga}</div>
            </div>
          ))}
        </Modal>
      )}

      {/* Drawer overlay */}
      {drawerOpen && <div className="fixed inset-0 z-[200] bg-black/40" onClick={() => setDrawer(false)} />}
      {/* Drawer */}
      <div style={{
        position:'fixed', top:0, right: drawerOpen ? 0 : -320, width:300, height:'100vh',
        background:'#fff', boxShadow:'-4px 0 24px rgba(0,0,0,.15)', zIndex:201,
        display:'flex', flexDirection:'column', transition:'right .28s cubic-bezier(.4,0,.2,1)', overflowY:'auto',
      }}>
        <div style={{ background:'linear-gradient(135deg,var(--purple),#7c3aed)', padding:'24px 20px', flexShrink:0, position:'relative' }}>
          <button onClick={() => setDrawer(false)} style={{ position:'absolute', top:14, right:14, background:'rgba(255,255,255,.2)', border:'none', color:'#fff', width:30, height:30, borderRadius:'50%', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          <div style={{ width:54, height:54, borderRadius:'50%', background:'rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:10 }}>🛠️</div>
          <div style={{ fontSize:16, fontWeight:800, color:'#fff' }}>{UP?.nama || CU?.email || '—'}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.75)', wordBreak:'break-all' }}>{CU?.email || '—'}</div>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:20, background:'rgba(255,255,255,.2)', color:'#fff', fontSize:11, fontWeight:800, marginTop:7 }}>🛠️ Admin</span>
        </div>
        <nav style={{ flex:1, padding:'12px 0' }}>
          {[['👤','Profil Akun',() => { setDrawer(false); setShowProfil(true) }],
            ['🕐','Lihat Riwayat Booking',() => { setDrawer(false); setShowRiwayat(true) }]].map(([ico,lbl,fn]) => (
            <button key={lbl} onClick={fn} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 20px', cursor:'pointer', border:'none', background:'none', width:'100%', fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:700, color:'var(--text-mid)', transition:'all .14s', textAlign:'left' }}
              onMouseEnter={e => e.currentTarget.style.background='var(--gray-light)'}
              onMouseLeave={e => e.currentTarget.style.background='none'}>
              <span style={{ fontSize:18, width:24, textAlign:'center' }}>{ico}</span>{lbl}
            </button>
          ))}
          <div style={{ height:1, background:'var(--border)', margin:'6px 0' }} />
          <button onClick={() => { setDrawer(false); setConfirmLogout(true) }}
            style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 20px', cursor:'pointer', border:'none', background:'none', width:'100%', fontFamily:'Nunito,sans-serif', fontSize:14, fontWeight:700, color:'var(--red)', textAlign:'left' }}>
            <span style={{ fontSize:18, width:24, textAlign:'center' }}>🚪</span>Log Out
          </button>
        </nav>
      </div>

      {/* Topbar */}
      <div style={{ background:'linear-gradient(135deg,var(--purple),#7c3aed)', padding:'0 28px', display:'flex', alignItems:'center', justifyContent:'space-between', height:90, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:50, height:50, background:'rgba(255,255,255,.2)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🛡️</div>
          <div>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>Admin Dashboard</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.75)', marginTop:2 }}>Bengkel Aja</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button onClick={() => setConfirmLogout(true)} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'Nunito,sans-serif', opacity:.9 }}>
            <span style={{ fontSize:18 }}>→|</span> Logout
          </button>
          <button onClick={() => setDrawer(true)} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', display:'flex', flexDirection:'column', gap:5, padding:4 }}>
            {[0,1,2].map(i => <span key={i} style={{ display:'block', width:22, height:2, background:'#fff', borderRadius:2 }} />)}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'0 28px', display:'flex', gap:4, overflowX:'auto' }}>
        {[['booking','👥','Booking'],['layanan','☰','Layanan'],['mekanik','📞','Mekanik']].map(([key,ico,lbl]) => (
          <button key={key} className={`admin-tab-btn${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
            <span style={{ fontSize:17 }}>{ico}</span> {lbl}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:'24px 28px', maxWidth:1200, width:'100%', margin:'0 auto' }}>
        <div className="fade-in" key={tab}>
          {tab === 'booking' && <BookingTab />}
          {tab === 'layanan' && <LayananAdminTab />}
          {tab === 'mekanik' && <MekanikAdminTab />}
        </div>
      </div>
    </div>
  )
}
