import { useEffect, useState } from "react";
import { Plus, Check } from "lucide-react";
import Modal from "./Modal";
import { useUserContext } from "../../providers/UserProvider";
import type { Tag } from "../../common/types";
import ColorPicker, { ColorPickerModal } from "./ColorPicker";
import { presetColors } from "../../common/constants";

interface TagPickerModalProps {
    open: boolean;
    onClose: () => void;
    currentTags: string[];
    onToggleTag: (tagName: string, checked: boolean) => void;
}


export default function TagPickerModal({ open, onClose, currentTags, onToggleTag }: TagPickerModalProps) {
    const { user_profile, addTag, updateTag } = useUserContext();
    const [creatingTag, setCreatingTag] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newColor, setNewColor] = useState(presetColors[0]);
    const [creationError, setCreationError] = useState<string | null>(null);
    const [colorPickerContext, setColorPickerContext] = useState<'create' | { tagName: string } | null>(null);
    const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);
    const [colorPickerInitialColor, setColorPickerInitialColor] = useState<string>("#ffffff");
    const allTags = [...(user_profile?.tags || [])].sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    const tagExists = () => allTags.some(t => t.name.toLowerCase() === newName.trim().toLowerCase());

    const handleCreateTag = () => {
        if (!newName.trim()) return;
        
        if (tagExists()) {
            return;
        }
        
        const tag: Tag = {
            name: newName.trim(),
            description: newDescription.trim(),
            color: newColor
        };
        
        addTag(tag);
        
        setNewName("");
        setNewDescription("");
        setNewColor(presetColors[0]);
        setCreationError(null);
        setCreatingTag(false);
    };

    const handleColorSelect = (color: string) => {
        if (colorPickerContext === 'create') {
            setNewColor(color);
        } else if (colorPickerContext && 'tagName' in colorPickerContext) {
            const tag = user_profile?.tags?.find(t => t.name === colorPickerContext.tagName);
            if (tag) {
                updateTag(colorPickerContext.tagName, {
                    ...tag,
                    color
                });
            }
        }
    };

    const handleCreateTagColorPick = (color: string) => {
        setNewColor(color);
    };

    useEffect(() => {
        if(tagExists()) setCreationError("A tag with this name already exists");
        else setCreationError(null);
    }, [ newName ]);

    return (
        <Modal open={open} onClose={onClose} title="Manage Tags">
            <div className="space-y-4">
                {/* Create new tag section */}
                {creatingTag ? (
                    <div className="p-3 border dark:border-gray-600 rounded-lg space-y-3">
                        { creationError && <p className="text-center text-red-200">{creationError}</p> }
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Tag name"
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <input
                            type="text"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Description (optional)"
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ColorPicker
                            onColorPick={handleCreateTagColorPick}
                            defaultColor={newColor}
                        />
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setCreatingTag(false); setNewName(""); setNewDescription(""); setNewColor(presetColors[0]); }}
                                className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTag}
                                disabled={!newName.trim()}
                                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setCreatingTag(true)}
                        className="w-full flex items-center gap-2 p-3 border-2 border-dashed dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500"
                    >
                        <Plus size={16} />
                        Create new tag
                    </button>
                )}

                {/* Tag list - sorted alphabetically */}
                {allTags.length > 0 && (
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500 mb-2">Available tags ({allTags.length})</div>
                        {allTags.map(tag => {
                            const isChecked = currentTags.includes(tag.name);
                            return (
                                <label
                                    key={tag.name}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    <div 
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isChecked ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    >
                                        {isChecked && <Check size={14} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => onToggleTag(tag.name, e.target.checked)}
                                        className="sr-only"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setColorPickerInitialColor(tag.color);
                                            setColorPickerContext({ tagName: tag.name });
                                            setColorPickerOpen(true);
                                        }}
                                        className="w-3 h-3 rounded-full flex-shrink-0 hover:ring-2 hover:ring-offset-1 hover:ring-gray-400 dark:hover:ring-gray-500 transition-all cursor-pointer"
                                        style={{ backgroundColor: tag.color }}
                                        title="Change color"
                                    />
                                    <span className="flex-1">{tag.name}</span>
                                    {tag.description && (
                                        <span className="text-xs text-gray-400 truncate max-w-[120px]">
                                            {tag.description}
                                        </span>
                                    )}
                                </label>
                            );
                        })}
                    </div>
                )}

                {allTags.length === 0 && !creatingTag && (
                    <p className="text-center text-gray-500 py-4">
                        No tags yet. Create one above!
                    </p>
                )}
            </div>

            {/* Color Picker Modal for editing tag colors */}
            <ColorPickerModal
                open={colorPickerOpen && colorPickerContext !== null && colorPickerContext !== 'create'}
                onClose={() => {
                    setColorPickerOpen(false);
                    setColorPickerContext(null);
                }}
                initialColor={colorPickerInitialColor}
                onSelectColor={handleColorSelect}
            />
        </Modal>
    );
}
