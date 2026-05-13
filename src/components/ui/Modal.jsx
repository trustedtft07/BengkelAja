export default function Modal({ children, onClose, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.45)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="anim-pop relative bg-white w-full"
        style={{
          borderRadius: 20, padding: '28px 24px 22px',
          maxWidth: wide ? 520 : 400,
          boxShadow: '0 20px 60px rgba(0,0,0,.2)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3.5 bg-transparent border-none text-xl cursor-pointer"
          style={{ color: 'var(--text-light)' }}
        >✕</button>
        {children}
      </div>
    </div>
  )
}
