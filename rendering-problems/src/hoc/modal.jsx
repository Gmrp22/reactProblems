export default function Modal({ children, title = "Modal", isOpen, close }) {


  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '32rem',
          width: '100%',
          margin: '0 1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{title}</h2>
          <button
            style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            ×
          </button>
        </div>
        <div style={{ color: '#4b5563' }}>
          {children}
        </div>
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={close}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}