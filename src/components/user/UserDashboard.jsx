import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import ConfirmDialog from '../ui/ConfirmDialog'
import BerandaTab from './tabs/BerandaTab'
import LayananTab from './tabs/LayananTab'
import PanggilTab from './tabs/PanggilTab'
import ProfilTab  from './tabs/ProfilTab'
import RiwayatTab from './tabs/RiwayatTab'

const TABS = {
  beranda: { label:'Beranda',         sub:'Solusi cepat untuk kendaraan Anda',       ico:'🏠' },
  layanan: { label:'Cari Layanan',    sub:'Temukan layanan yang Anda butuhkan',       ico:'🔍' },
  panggil: { label:'Panggil Mekanik', sub:'Bantuan darurat 24 jam',                  ico:'📞' },
  profil:  { label:'Profil Akun',     sub:'Kelola informasi Anda',                   ico:'👤' },
  riwayat: { label:'Riwayat Booking', sub:'Semua booking Anda',                      ico:'🕐' },
}

export default function UserDashboard() {
  const { UP, CU, doLogout } = useApp()
  const [tab, setTab]           = useState('beranda')
  const [sideOpen, setSideOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  const switchTab = (t) => { setTab(t); setSideOpen(false) }

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {confirmLogout && (
        <ConfirmDialog
          title="Keluar?"
          msg="Anda akan diarahkan ke halaman login."
          okLabel="Keluar"
          okClass="btn-red"
          onOk={() => { setConfirmLogout(false); doLogout() }}
          onCancel={() => setConfirmLogout(false)}
        />
      )}

      {/* Sidebar overlay on mobile */}
      {sideOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSideOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`user-sidebar${sideOpen ? ' open' : ''}`}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'20px 18px 16px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ width:36, height:36, background:'var(--purple)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🔧</div>
          <div style={{ fontSize:17, fontWeight:900, color:'var(--purple)' }}>Bengkel Aja</div>
        </div>
        <div style={{ padding:'14px 18px', background:'var(--purple-light)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, marginBottom:7 }}>👤</div>
          <div style={{ fontSize:13, fontWeight:800 }}>{UP?.nama || CU?.email || '—'}</div>
          <div style={{ fontSize:11, color:'var(--text-mid)', wordBreak:'break-all' }}>{CU?.email || '—'}</div>
        </div>
        <nav style={{ flex:1, padding:'10px 0' }}>
          {Object.entries(TABS).map(([key, { label, ico }]) => (
            <button key={key} className={`sb-item${tab === key ? ' active' : ''}`} onClick={() => switchTab(key)}>
              <span style={{ fontSize:16, width:20, textAlign:'center' }}>{ico}</span>{label}
            </button>
          ))}
          <div style={{ height:1, background:'var(--border)', margin:'6px 0' }} />
          <button className="sb-item danger" onClick={() => setConfirmLogout(true)}>
            <span style={{ fontSize:16, width:20, textAlign:'center' }}>🚪</span>Keluar
          </button>
        </nav>
        <div style={{ padding:'12px 18px', borderTop:'1px solid var(--border)', fontSize:11, color:'var(--text-light)' }}>© 2026 Bengkel Aja</div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft:260, flex:1, display:'flex', flexDirection:'column' }}>
        {/* Topbar */}
        <header style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:40 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button className="mob-menu-btn" style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', display:'none' }}
              onClick={() => setSideOpen(p => !p)}>☰</button>
            <div>
              <div style={{ fontSize:18, fontWeight:900 }}>{TABS[tab]?.label}</div>
              <div style={{ fontSize:12, color:'var(--text-light)' }}>{TABS[tab]?.sub}</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:13, fontWeight:700, color:'var(--text-mid)' }}>{UP?.nama || ''}</span>
            <button className="btn btn-sm btn-outline" onClick={() => setConfirmLogout(true)}>Keluar</button>
          </div>
        </header>

        <div style={{ padding:24, flex:1 }}>
          {tab === 'beranda' && <BerandaTab onSwitchTab={switchTab} />}
          {tab === 'layanan' && <LayananTab onSwitchTab={switchTab} />}
          {tab === 'panggil' && <PanggilTab onSwitchTab={switchTab} />}
          {tab === 'profil'  && <ProfilTab />}
          {tab === 'riwayat' && <RiwayatTab />}
        </div>
      </main>
    </div>
  )
}
