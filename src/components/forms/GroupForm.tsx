import ColorPicker from "../ui/ColorPicker";

interface GroupFormProps {
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    color: string;
    setColor: (color: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
    submitLabel: string;
}

export function GroupForm({
    title,
    setTitle,
    description,
    setDescription,
    color,
    setColor,
    onCancel,
    onSubmit,
    submitLabel
}: GroupFormProps) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Group title"
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Group description"
                    rows={2}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>

            <ColorPicker
                onColorPick={setColor}
                defaultColor={color}
            />
            
            <div className="flex gap-2 pt-2">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}
