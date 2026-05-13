import Modal from '../ui/Modal'

export default function BookingOkModal({ onClose, onLihat }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:17, fontWeight:900, marginBottom:4 }}>Booking Berhasil!</div>
        <div style={{ fontSize:13, color:'var(--text-mid)', marginBottom:18 }}>Booking Anda menunggu konfirmasi dari admin</div>
        <div className="modal-check">✓</div>
        <button className="btn-lihat" onClick={() => { onClose(); onLihat() }}>Lihat Riwayat Booking</button>
      </div>
    </Modal>
  )
}
