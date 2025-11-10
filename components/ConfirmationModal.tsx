import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isConfirming: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isConfirming,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={!isConfirming ? onClose : undefined}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-stone-900">{title}</h3>
        <p className="text-sm text-stone-600 mt-2">{message}</p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="px-4 py-2 rounded-md font-semibold text-sm bg-stone-200 text-stone-800 hover:bg-stone-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-4 py-2 rounded-md font-semibold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center w-24 disabled:bg-red-400 disabled:cursor-wait"
          >
            {isConfirming ? <SpinnerIcon /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;