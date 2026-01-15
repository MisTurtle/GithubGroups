import { createContext, useCallback, useContext, type ReactNode } from "react";
import type { EntryGroup, SingleEntry, Tag, Theme, UserProfile } from "../common/types";
import { save_user_profile } from "../common/user_profile";

interface UserContextType {
    user_profile: UserProfile | undefined;
    setTheme: (theme: Theme) => void;
    
    // Tag operations
    addTag: (tag: Tag) => void;
    updateTag: (oldName: string, tag: Tag) => void;
    deleteTag: (name: string) => void;
    getTagByName: (name: string) => Tag | undefined;
    
    // Group operations
    addGroup: (group: EntryGroup) => void;
    updateGroup: (index: number, settings: EntryGroup['settings']) => void;
    deleteGroup: (index: number) => void;
    reorderGroups: (fromIndex: number, toIndex: number) => void;
    
    // Entry operations
    addEntry: (groupIndex: number, entry: SingleEntry) => void;
    updateEntry: (groupIndex: number, entryIndex: number, entry: SingleEntry) => void;
    deleteEntry: (groupIndex: number, entryIndex: number) => void;
    reorderEntries: (groupIndex: number, fromIndex: number, toIndex: number) => void;
    addTagToEntry: (groupIndex: number, entryIndex: number, tagName: string) => void;
    removeTagFromEntry: (groupIndex: number, entryIndex: number, tagName: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ user_profile, children }: { 
    user_profile: UserProfile | undefined;
    children: ReactNode;
}) => {
    const saveProfile = useCallback((updater: (profile: UserProfile) => UserProfile) => {
        if (!user_profile) return;
        const newProfile = updater({ ...user_profile });
        save_user_profile(newProfile);
    }, [user_profile]);

    const setTheme = useCallback((theme: Theme) => {
        saveProfile(profile => ({
            ...profile,
            settings: { ...profile.settings, theme }
        }));
    }, [saveProfile]);

    // Tag operations
    const addTag = useCallback((tag: Tag) => {
        saveProfile(profile => ({
            ...profile,
            tags: [...(profile.tags || []), tag]
        }));
    }, [saveProfile]);

    const updateTag = useCallback((oldName: string, tag: Tag) => {
        saveProfile(profile => ({
            ...profile,
            tags: profile.tags?.map(t => t.name === oldName ? tag : t) || []
        }));
    }, [saveProfile]);

    const deleteTag = useCallback((name: string) => {
        saveProfile(profile => ({
            ...profile,
            tags: profile.tags?.filter(t => t.name !== name) || []
        }));
    }, [saveProfile]);

    const getTagByName = useCallback((name: string): Tag | undefined => {
        return user_profile?.tags?.find(tag => tag.name === name);
    }, [user_profile]);

    // Group operations
    const addGroup = useCallback((group: EntryGroup) => {
        saveProfile(profile => ({
            ...profile,
            groups: [...(profile.groups || []), group]
        }));
    }, [saveProfile]);

    const updateGroup = useCallback((index: number, settings: EntryGroup['settings']) => {
        saveProfile(profile => ({
            ...profile,
            groups: profile.groups?.map((g, i) => 
                i === index ? { ...g, settings } : g
            ) || []
        }));
    }, [saveProfile]);

    const deleteGroup = useCallback((index: number) => {
        saveProfile(profile => ({
            ...profile,
            groups: profile.groups?.filter((_, i) => i !== index) || []
        }));
    }, [saveProfile]);

    const reorderGroups = useCallback((fromIndex: number, toIndex: number) => {
        saveProfile(profile => {
            const groups = [...(profile.groups || [])];
            const [removed] = groups.splice(fromIndex, 1);
            groups.splice(toIndex, 0, removed);
            return { ...profile, groups };
        });
    }, [saveProfile]);

    // Entry operations
    const addEntry = useCallback((groupIndex: number, entry: SingleEntry) => {
        saveProfile(profile => ({
            ...profile,
            groups: profile.groups?.map((g, i) => 
                i === groupIndex ? {
                    ...g,
                    repositories: [...g.repositories, entry]
                } : g
            ) || []
        }));
    }, [saveProfile]);

    const updateEntry = useCallback((groupIndex: number, entryIndex: number, entry: SingleEntry) => {
        saveProfile(profile => ({
            ...profile,
            groups: profile.groups?.map((g, i) => 
                i === groupIndex ? {
                    ...g,
                    repositories: g.repositories.map((e, j) => 
                        j === entryIndex ? entry : e
                    )
                } : g
            ) || []
        }));
    }, [saveProfile]);

    const deleteEntry = useCallback((groupIndex: number, entryIndex: number) => {
        saveProfile(profile => ({
            ...profile,
            groups: profile.groups?.map((g, i) => 
                i === groupIndex ? {
                    ...g,
                    repositories: g.repositories.filter((_, j) => j !== entryIndex)
                } : g
            ) || []
        }));
    }, [saveProfile]);

    const reorderEntries = useCallback((groupIndex: number, fromIndex: number, toIndex: number) => {
        saveProfile(profile => ({
            ...profile,
            groups: profile.groups?.map((g, i) => {
                if (i !== groupIndex) return g;
                const repos = [...g.repositories];
                const [removed] = repos.splice(fromIndex, 1);
                repos.splice(toIndex, 0, removed);
                return { ...g, repositories: repos };
            }) || []
        }));
    }, [saveProfile]);

    const addTagToEntry = useCallback((groupIndex: number, entryIndex: number, tagName: string) => {
        saveProfile(profile => ({
            ...profile,
            groups: profile.groups?.map((g, i) => 
                i === groupIndex ? {
                    ...g,
                    repositories: g.repositories.map((e, j) => 
                        j === entryIndex ? {
                            ...e,
                            tags: [...(e.tags || []), tagName]
                        } : e
                    )
                } : g
            ) || []
        }));
    }, [saveProfile]);

    const removeTagFromEntry = useCallback((groupIndex: number, entryIndex: number, tagName: string) => {
        saveProfile(profile => ({
            ...profile,
            groups: profile.groups?.map((g, i) => 
                i === groupIndex ? {
                    ...g,
                    repositories: g.repositories.map((e, j) => 
                        j === entryIndex ? {
                            ...e,
                            tags: e.tags?.filter(t => t !== tagName) || []
                        } : e
                    )
                } : g
            ) || []
        }));
    }, [saveProfile]);

    return (
        <UserContext.Provider value={{ 
            user_profile, 
            getTagByName,
            setTheme,
            addTag,
            updateTag,
            deleteTag,
            addGroup,
            updateGroup,
            deleteGroup,
            reorderGroups,
            addEntry,
            updateEntry,
            deleteEntry,
            reorderEntries,
            addTagToEntry,
            removeTagFromEntry
        }}>
            { children }
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if(!context) throw new Error("useUserContext must be used within a UserProvider tag");
    return context;
}
