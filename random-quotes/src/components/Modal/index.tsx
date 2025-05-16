import { ModalProps } from "../../types/modal";

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-3/4 max-w-lg">
        <button
          className="absolute top-5 right-5 text-3xl font-extrabold text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close modal"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
