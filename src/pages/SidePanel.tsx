import type { RepositorySource, SingleEntry, UserProfile } from "../common/types";

import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { load_user_profile } from "../common/user_profile";

import { presetColors, user_profile_storage_key } from "../common/constants";
import GroupComponent from "../components/cards/GroupComponent";
import ThemeToggle from "../components/ui/ThemeToggle";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ui/ConfirmModal";
import TagPickerModal from "../components/ui/TagPickerModal";
import { UserProvider, useUserContext } from "../providers/UserProvider";

import { Settings, Plus } from "lucide-react";
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

import "./styles.css";
import { AddRepositoryForm, EditEntryForm } from "../components/forms/RepositoryForm";
import { GroupForm } from "../components/forms/GroupForm";

function SidePanelContent() {
    const { 
        user_profile, 
        reorderGroups, 
        addGroup, 
        updateGroup,
        deleteGroup,
        addEntry,
        updateEntry,
        deleteEntry,
        addTagToEntry,
        removeTagFromEntry
    } = useUserContext();
    
    // Modal states
    const [editGroupModal, setEditGroupModal] = useState<{ open: boolean; index: number | null }>({ open: false, index: null });
    const [editEntryModal, setEditEntryModal] = useState<{ open: boolean; groupIndex: number; entryIndex: number; entry: SingleEntry } | null>(null);
    const [addGroupModal, setAddGroupModal] = useState(false);
    const [addRepoModal, setAddRepoModal] = useState<{ open: boolean; groupIndex: number } | null>(null);
    const [tagPickerModal, setTagPickerModal] = useState<{ 
        open: boolean; 
        type: 'group' | 'entry'; 
        groupIndex: number; 
        entryIndex?: number;
    } | null>(null);
    
    // Confirmation modal states
    const [deleteGroupConfirm, setDeleteGroupConfirm] = useState<{ open: boolean; index: number } | null>(null);
    const [deleteEntryConfirm, setDeleteEntryConfirm] = useState<{ open: boolean; groupIndex: number; entryIndex: number } | null>(null);
    
    // Form states
    const [groupTitle, setGroupTitle] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupColor, setGroupColor] = useState(presetColors[0]);
    const [entryUrl, setEntryUrl] = useState("");
    const [entrySource, setEntrySource] = useState<RepositorySource | null>(null);
    const [newRepoUrl, setNewRepoUrl] = useState("");
    const [newRepoSource, setNewRepoSource] = useState<RepositorySource | null>(null);

    // TODO : Clean states here. Most are useless

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Apply theme class to document
    useEffect(() => {
        const isDark = user_profile?.settings?.theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
    }, [user_profile?.settings?.theme]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const fromIndex = parseInt(String(active.id).split('-')[1]);
            const toIndex = parseInt(String(over.id).split('-')[1]);
            reorderGroups(fromIndex, toIndex);
        }
    };

    const openSettings = () => {
        const url = chrome.runtime.getURL("pages/settings.html");
        chrome.tabs.create({ url });
    };

    // Group handlers
    const handleOpenEditGroup = (index: number) => {
        const group = user_profile?.groups?.[index];
        if (!group) return;
        setGroupTitle(group.settings?.title || "");
        setGroupDescription(group.settings?.description || "");
        setGroupColor(group.settings?.color || "#3b82f6");
        setEditGroupModal({ open: true, index });
    };

    const handleCollapseChangeGroup = (index: number, expanded: boolean) => {
        const group = user_profile?.groups?.[index];
        if (!group) return;
        updateGroup(index, {
            ...group?.settings,
            expanded: expanded
        });
    };

    const handleSaveGroup = () => {
        if (editGroupModal.index !== null) {
            const group = user_profile?.groups?.[editGroupModal.index];
            updateGroup(editGroupModal.index, {
                ...group?.settings,
                title: groupTitle,
                description: groupDescription,
                color: groupColor
            });
        }
        setEditGroupModal({ open: false, index: null });
    };

    const handleCreateGroup = () => {
        addGroup({
            settings: { title: groupTitle || "New Group", description: groupDescription, color: groupColor },
            repositories: []
        });
        setGroupTitle("");
        setGroupDescription("");
        setGroupColor("#3b82f6");
        setAddGroupModal(false);
    };

    const handleConfirmDeleteGroup = () => {
        if (deleteGroupConfirm) {
            deleteGroup(deleteGroupConfirm.index);
        }
    };

    // Entry handlers
    const handleOpenEditEntry = (groupIndex: number, entryIndex: number, entry: SingleEntry) => {
        setEntryUrl(entry.url);
        setEntrySource(entry.source);
        setEditEntryModal({ open: true, groupIndex, entryIndex, entry });
    };

    const handleSaveEntry = () => {
        if (!editEntryModal || !entrySource) return;

        updateEntry(editEntryModal.groupIndex, editEntryModal.entryIndex, {
            ...editEntryModal.entry,
            url: entryUrl,
            source: entrySource
        });
        setEditEntryModal(null);
    };

    const handleConfirmDeleteEntry = () => {
        if (deleteEntryConfirm) {
            deleteEntry(deleteEntryConfirm.groupIndex, deleteEntryConfirm.entryIndex);
        }
    };

    // Add repository handler
    const handleAddRepository = () => {
        if (!addRepoModal || !newRepoUrl.trim() || !newRepoSource) return;
        addEntry(addRepoModal.groupIndex, {
            url: newRepoUrl.trim(),
            source: newRepoSource,
            tags: []
        });
        setNewRepoUrl("");
        setNewRepoSource(null);
        setAddRepoModal(null);
    };

    // Tag picker handlers
    const handleOpenEntryTags = (groupIndex: number, entryIndex: number) => {
        setTagPickerModal({ open: true, type: 'entry', groupIndex, entryIndex });
    };

    const getCurrentTags = () => {
        if (!tagPickerModal) return [];
        return user_profile?.groups?.[tagPickerModal.groupIndex]?.repositories[tagPickerModal.entryIndex!]?.tags || [];
    };

    const handleToggleTag = (tagName: string, checked: boolean) => {
        if (!tagPickerModal) return;
        
       if (checked) {
            addTagToEntry(tagPickerModal.groupIndex, tagPickerModal.entryIndex!, tagName);
        } else {
            removeTagFromEntry(tagPickerModal.groupIndex, tagPickerModal.entryIndex!, tagName);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3">
                <div className="flex items-center justify-between">
                    
                    {/* Controls */}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setAddGroupModal(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <Plus size={16} />
                            New Group
                        </button>
                        
                        {/* <button
                            onClick={() => setAddGroupModal(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            <ImportIcon size={16} />
                            Import Profile
                        </button> */}
                    </div>
                    

                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                        <button onClick={openSettings} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                            <Settings size={18} />
                        </button>
                    </div>

                </div>
            </header>

            {/* Main content */}
            <main className="p-4 space-y-4">
                {/* Groups */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={(user_profile?.groups || []).map((_, idx) => `group-${idx}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {user_profile?.groups?.map((group, idx) => (
                                <GroupComponent 
                                    key={idx}
                                    group={group}
                                    groupIndex={idx}
                                    onEditGroup={() => handleOpenEditGroup(idx)}
                                    onCollapseChange={handleCollapseChangeGroup}
                                    onEditEntry={handleOpenEditEntry}
                                    onManageEntryTags={handleOpenEntryTags}
                                    onAddRepository={() => setAddRepoModal({ open: true, groupIndex: idx })}
                                    onDeleteGroup={() => setDeleteGroupConfirm({ open: true, index: idx })}
                                    onDeleteEntry={(groupIndex, entryIndex) => setDeleteEntryConfirm({ open: true, groupIndex, entryIndex })}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {(!user_profile?.groups || user_profile.groups.length === 0) && (
                    <p className="text-center text-gray-400 py-8">
                        You have not created any group yet. Get started with the "New Group" button
                    </p>
                )}
            </main>

            {/* Add Group Modal */}
            <Modal open={addGroupModal} onClose={() => setAddGroupModal(false)} title="Add Group">
                <GroupForm
                    title={groupTitle}
                    setTitle={setGroupTitle}
                    description={groupDescription}
                    setDescription={setGroupDescription}
                    color={groupColor}
                    setColor={setGroupColor}
                    onCancel={() => setAddGroupModal(false)}
                    onSubmit={handleCreateGroup}
                    submitLabel="Create"
                />
            </Modal>

            {/* Edit Group Modal */}
            <Modal 
                open={editGroupModal.open} 
                onClose={() => setEditGroupModal({ open: false, index: null })} 
                title="Edit Group"
            >
                <GroupForm
                    title={groupTitle}
                    setTitle={setGroupTitle}
                    description={groupDescription}
                    setDescription={setGroupDescription}
                    color={groupColor}
                    setColor={setGroupColor}
                    onCancel={() => setEditGroupModal({ open: false, index: null })}
                    onSubmit={handleSaveGroup}
                    submitLabel="Save"
                />
            </Modal>

            {/* Edit Entry Modal */}
            <Modal 
                open={!!editEntryModal} 
                onClose={() => setEditEntryModal(null)} 
                title="Edit Entry"
            >
                <EditEntryForm
                    entryUrl={entryUrl}
                    setEntryUrl={setEntryUrl}
                    setEntrySource={setEntrySource}
                    onCancel={() => setEditEntryModal(null)}
                    onSave={handleSaveEntry}
                />
            </Modal>

            {/* Add Repository Modal */}
            <Modal
                open={!!addRepoModal?.open}
                onClose={() => { setAddRepoModal(null); setNewRepoUrl(""); setNewRepoSource(null); }}
                title="Add Repository"
            >
                <AddRepositoryForm
                    newRepoUrl={newRepoUrl}
                    setNewRepoUrl={setNewRepoUrl}
                    setNewRepoSource={setNewRepoSource}
                    onCancel={() => { setAddRepoModal(null); setNewRepoUrl(""); setNewRepoSource(null); }}
                    onAdd={handleAddRepository}
                />
            </Modal>

            {/* Tag Picker Modal */}
            <TagPickerModal
                open={!!tagPickerModal?.open}
                onClose={() => setTagPickerModal(null)}
                currentTags={getCurrentTags()}
                onToggleTag={handleToggleTag}
            />

            {/* Delete Group Confirmation */}
            <ConfirmModal
                open={!!deleteGroupConfirm?.open}
                onClose={() => setDeleteGroupConfirm(null)}
                onConfirm={handleConfirmDeleteGroup}
                title="Delete Group"
                message="Are you sure you want to delete this group? All repositories in this group will be removed. This action cannot be undone."
                confirmText="Delete"
                confirmColor="red"
            />

            {/* Delete Entry Confirmation */}
            <ConfirmModal
                open={!!deleteEntryConfirm?.open}
                onClose={() => setDeleteEntryConfirm(null)}
                onConfirm={handleConfirmDeleteEntry}
                title="Remove Repository"
                message="Are you sure you want to remove this repository from the group? This action cannot be undone."
                confirmText="Remove"
                confirmColor="red"
            />
        </div>
    );
}

function SidePanel() {
    const [userProfile, setUserProfile] = useState<UserProfile>();

    useEffect(() => {
        load_user_profile().then(setUserProfile);
        
        const changeListener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if (!changes[user_profile_storage_key]) return;
            const newProfileJson = changes[user_profile_storage_key].newValue as string;
            setUserProfile(JSON.parse(newProfileJson));
        };
        chrome.storage.local.onChanged.addListener(changeListener);

        return () => chrome.storage.local.onChanged.removeListener(changeListener);
    }, []);

    return (
        <UserProvider user_profile={userProfile}>
            <SidePanelContent />
        </UserProvider>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SidePanel />
    </StrictMode>,
);
