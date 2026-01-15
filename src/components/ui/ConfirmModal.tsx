import Modal from "./Modal";

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    confirmColor?: 'red' | 'blue';
}

export default function ConfirmModal({ 
    open, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmText = "Confirm",
    confirmColor = "red"
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const confirmClass = confirmColor === 'red' 
        ? 'bg-red-500 hover:bg-red-600' 
        : 'bg-blue-500 hover:bg-blue-600';

    return (
        <Modal open={open} onClose={onClose} title={title}>
            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">{message}</p>
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-2 text-white rounded-lg ${confirmClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
