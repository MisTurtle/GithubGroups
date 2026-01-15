export type RepositorySource = "github";
export type Theme = "light" | "dark";

export type Tag = {
    name: string;
    description: string;
    color: string;
}

export type SingleEntry = {
    source: RepositorySource;
    url: string;
    tags?: string[];
};

export type GroupSettings = {
    title?: string;
    description?: string;
    color?: string;
    expanded?: boolean;
};

export type EntryGroup = {
    settings?: GroupSettings;
    repositories: SingleEntry[];
};

export type UserSettings = {
    theme: Theme
};

export type UserProfile = {
    settings: UserSettings | undefined;
    groups: EntryGroup[] | undefined;
    tags: Tag[] | undefined;
};
