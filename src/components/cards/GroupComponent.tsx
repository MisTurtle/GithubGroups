import type { EntryGroup, SingleEntry } from "../../common/types";
import EntryComponent from "./EntryComponent";
import { useUserContext } from "../../providers/UserProvider";
import { GripVertical, Pencil, Trash2, ChevronDown, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
    DndContext, 
    closestCenter, 
    KeyboardSensor, 
    PointerSensor, 
    useSensor, 
    useSensors,
    type DragEndEvent 
} from "@dnd-kit/core";
import { 
    SortableContext, 
    sortableKeyboardCoordinates, 
    verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

interface GroupComponentProps {
    group: EntryGroup;
    groupIndex: number;
    onEditGroup: () => void;
    onEditEntry: (groupIndex: number, entryIndex: number, entry: SingleEntry) => void;
    onCollapseChange: (groupIndex: number, expanded: boolean) => void;
    onManageEntryTags: (groupIndex: number, entryIndex: number) => void;
    onAddRepository: () => void;
    onDeleteGroup: () => void;
    onDeleteEntry: (groupIndex: number, entryIndex: number) => void;
}

export default function GroupComponent({ 
    group, 
    groupIndex, 
    onEditGroup,
    onEditEntry, 
    onCollapseChange,
    onManageEntryTags,
    onAddRepository,
    onDeleteGroup,
    onDeleteEntry
}: GroupComponentProps) {
    const { reorderEntries } = useUserContext();
    const [expanded, setExpanded] = useState(group.settings?.expanded ?? true);

    useEffect(() => {
        onCollapseChange(groupIndex, expanded);
    }, [ groupIndex, expanded ]);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `group-${groupIndex}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        borderLeft: `4px solid ${group.settings?.color ?? "transparent"}`
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const fromIndex = parseInt(String(active.id).split('-')[2]);
            const toIndex = parseInt(String(over.id).split('-')[2]);
            reorderEntries(groupIndex, fromIndex, toIndex);
        }
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
        >
            {/* Header */}
            <div 
                className="flex items-center gap-2 p-3"
            >
                <button
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical size={14} />
                </button>

                <button 
                    onClick={() => setExpanded(!expanded)}
                    className="flex-1 flex items-center gap-2 text-left"
                >
                    <ChevronDown 
                        size={16} 
                        className={`text-gray-400 transition-transform ${expanded ? '' : '-rotate-90'}`} 
                    />
                    <div>
                        <h3 className="font-semibold">{group.settings?.title || "Untitled Group"}</h3>
                        {group.settings?.description && (
                            <p className="text-xs italic text-gray-400">{group.settings.description}</p>
                        )}
                    </div>
                </button>

                <div className="flex items-center gap-1">
                    <button 
                        onClick={onAddRepository}
                        className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                        title="Add repository"
                    >
                        <Plus size={14} />
                    </button>
                    <button 
                        onClick={onEditGroup} 
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        title="Edit group"
                    >
                        <Pencil size={14} />
                    </button>
                    <button 
                        onClick={onDeleteGroup} 
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Delete group"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {expanded && (
                <div className="px-3 pb-3 space-y-3">
                    {/* Entries */}
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext
                            items={group.repositories.map((_, idx) => `entry-${groupIndex}-${idx}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {group.repositories.map((entry, idx) => (
                                    <EntryComponent 
                                        key={idx}
                                        entry={entry}
                                        groupIndex={groupIndex}
                                        entryIndex={idx}
                                        onEdit={() => onEditEntry(groupIndex, idx, entry)}
                                        onManageTags={() => onManageEntryTags(groupIndex, idx)}
                                        onDelete={() => onDeleteEntry(groupIndex, idx)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {group.repositories.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-gray-400 text-sm mb-2">No repositories in this group yet.</p>
                            <button
                                onClick={onAddRepository}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-500 hover:text-blue-600 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                <Plus size={14} />
                                Add repository
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
