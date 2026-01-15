import { useCallback, useEffect, useState } from "react";
import Modal from "./Modal";
import { Plus } from "lucide-react";
import { presetColors } from "../../common/constants";

interface ColorPickerModalProps {
    open: boolean;
    onClose: () => void;
    initialColor: string;
    onSelectColor: (color: string) => void;
}

export function ColorPickerModal({ open, onClose, initialColor, onSelectColor }: ColorPickerModalProps) {
    const [selectedColor, setSelectedColor] = useState(initialColor);
    const [lastValidColor, setLastValidColor] = useState(initialColor);

    useEffect(() => {
        setSelectedColor(initialColor);
    }, [initialColor]);

    useEffect(() => {
        if(/^#[0-9A-Fa-f]{6}$/.test(selectedColor))
            setLastValidColor(selectedColor);
    }, [selectedColor]);

    const handleConfirm = () => {
        onSelectColor(selectedColor);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title="Pick Custom Color">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <input
                        type="color"
                        value={lastValidColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-16 h-16 rounded cursor-pointer border-2 border-gray-300 dark:border-gray-600 bg-transparent"
                    />
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Color Code</label>
                        <input
                            type="text"
                            value={selectedColor}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                    setSelectedColor(value);
                                }
                            }}
                            placeholder="#ffffff"
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default function ColorPicker({ onColorPick, defaultColor, presets = undefined }: {
    onColorPick: (pickedColor: string) => void;
    defaultColor: string;
    presets?: string[];
})
{
    presets ??= presetColors;
    const [pickedColor, _setPickedColor] = useState(defaultColor);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    
    const setPickedColor = useCallback((newColor: string) => {
        onColorPick(newColor);
        _setPickedColor(newColor);
    }, [onColorPick]);

    const pickedClasses = 'scale-125 ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800';
    return (
        <>
            {/* Color Picker Modal */}
            <ColorPickerModal
                open={colorPickerOpen}
                onClose={() => { setColorPickerOpen(false); }}
                initialColor={pickedColor}
                onSelectColor={setPickedColor}
            />
            <div className="space-y-2">
                <div className="flex gap-2 flex-wrap items-center">
                    {presets.map(c => (
                        <button
                            key={c}
                            onClick={() => setPickedColor(c)}
                            className={`w-6 h-6 rounded-full transition-transform ${pickedColor === c ? pickedClasses : ''}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                    <button
                        onClick={() => { setColorPickerOpen(true) }}
                        className={
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors border-dashed"
                            + (!presets.includes(pickedColor) ? pickedClasses : '')
                        }
                        style={{ color: pickedColor, borderColor: pickedColor }}
                        title="Custom color"
                    >
                        <Plus size={12} />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">{pickedColor}</span>
                </div>
            </div>
        </>
    );
}