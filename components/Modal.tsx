// Fix: Provided full implementation for the Modal component.
import React, { ReactNode, useEffect, useState } from 'react';
import { XIcon } from './icons';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const { playOpen, playClose } = useSoundEffects();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
        playOpen();
        setIsAnimatingOut(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    playClose();
    setIsAnimatingOut(true);
    setTimeout(onClose, 400); // match animation duration
  };

  if (!isOpen && !isAnimatingOut) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center p-4"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
      data-state={isOpen && !isAnimatingOut ? 'open' : 'closed'}
    >
      <div className="modal-overlay fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="modal-content bg-glass-bg backdrop-blur-xl border border-glass-border rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Close modal"
        >
          <XIcon size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;