import Toggle from "./toggle";

export default function Modal({ children, title = "Modal" }) {
  return (
    <Toggle
      style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
      component={({ close }) => (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={close}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <button 
                onClick={close}
                style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                ×
              </button>
            </div>
            <div className="text-gray-600">
              {children}
            </div>

          </div>
        </div>
      )}
    />
  );
}