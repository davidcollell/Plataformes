import React from 'react';

interface ConfirmationModalProps {
  itemTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ itemTitle, onConfirm, onCancel }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-brand-surface rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 animate-fade-in-up">
        <h2 id="modal-title" className="text-xl font-bold text-brand-text mb-4">
          Confirmar eliminació
        </h2>
        <p className="text-brand-text-muted mb-6">
          Estàs segur que vols eliminar "<strong>{itemTitle}</strong>"? Aquesta acció no es pot desfer.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="py-2 px-4 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500 text-white transition"
          >
            Cancel·lar
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded-md text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition"
          >
            Eliminar
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
