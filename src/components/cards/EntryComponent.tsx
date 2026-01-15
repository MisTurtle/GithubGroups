import type { SingleEntry } from "../../common/types";
import { utils } from "github-url-detection";
import TagComponent from "./TagComponent";
import { useUserContext } from "../../providers/UserProvider";
import { GripVertical, Pencil, Trash2, ExternalLink, Tags } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import Modal from "../ui/Modal";

interface EntryComponentProps {
    entry: SingleEntry;
    groupIndex: number;
    entryIndex: number;
    onEdit: () => void;
    onManageTags: () => void;
    onDelete: () => void;
}

export default function EntryComponent({ entry, groupIndex, entryIndex, onEdit, onManageTags, onDelete }: EntryComponentProps) {
    let url;
    try{
        url = new URL(entry.url);
    }catch{
        url = undefined;
    }
    let info = utils.getRepositoryInfo(url);
    const { getTagByName } = useUserContext();
    const [ errorModalOpened, setErrorModalOpened ] = useState<boolean>(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `entry-${groupIndex}-${entryIndex}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleOpenUrl = () => {
        if(url) chrome.tabs.create({ url: entry.url });
        else setErrorModalOpened(true);
    };

    if (!info) {
        info = {
            'name': entry.url,
            'nameWithOwner': `unknown/${entry.url}`,
            'owner': entry.source,
            'path': entry.url
        };
    }

    return (
        <>
        { errorModalOpened && <Modal 
            open={errorModalOpened}
            title={"Invalid URL"}
            onClose={() => setErrorModalOpened(false)}
            children={
                <p>Oops{ /* TODO : Change that */ }</p>
            }
        /> }
        <div 
            ref={setNodeRef} 
            style={style} 
            className="p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-sm transition-shadow"
        >
            <div className="flex items-start gap-2">
                {/* Drag handle */}
                <button
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical size={14} />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleOpenUrl}
                            className="font-medium text-sm hover:text-blue-500 truncate"
                        >
                            {info.nameWithOwner}
                        </button>
                        <button onClick={handleOpenUrl} className="text-gray-400 hover:text-blue-500">
                            <ExternalLink size={12} />
                        </button>
                    </div>
                    
                    <p className="text-xs text-gray-400 italic">{entry.source}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags?.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).map((tagName, idx) => (
                            <TagComponent 
                                key={idx} 
                                tag={getTagByName(tagName)}
                            />
                        ))}
                        <button
                            onClick={onManageTags}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-dashed dark:border-gray-600 rounded-full hover:border-gray-400"
                        >
                            <Tags size={10} />
                            Tags
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Pencil size={14} />
                    </button>
                    <button 
                        onClick={onDelete} 
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
        </>
   );
}
