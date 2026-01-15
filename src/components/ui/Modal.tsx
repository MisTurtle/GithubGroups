import { X } from "lucide-react";
import { type ReactNode } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(90vh-4rem)]">
                    {children}
                </div>
            </div>
        </div>
    );
}
