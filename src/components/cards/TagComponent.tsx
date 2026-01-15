import type { Tag } from "../../common/types";

interface TagComponentProps {
    tag: Tag | undefined;
    onClick?: () => void;
}

export default function TagComponent({ tag, onClick }: TagComponentProps) {
    if (!tag) return null;

    const content = (
        <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-all"
            style={{ 
                backgroundColor: `${tag.color}20`, 
                color: tag.color,
                borderColor: tag.color,
            }}
            onClick={onClick}
        >
            <span 
                className="w-2 h-2 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                style={{ backgroundColor: tag.color }}
            />
            {tag.name}
        </span>
    );

    if (tag.description) {
        return (
            <span className="group relative">
                {content}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {tag.description}
                </span>
            </span>
        );
    }

    return content;
}
