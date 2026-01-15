import type { UserProfile } from "./types";

export const user_profile_storage_key = "_github_groups:profile";
export const welcomed_shown_storage_key = "_github_groups:welcomed";

export const default_user_profile: UserProfile = {  // TODO : Change this to include this repo.
    groups: [
        {
            repositories: [
                {
                    source: 'github',
                    url: 'https://github.com/refined-github/github-url-detection/blob/main/index.ts'
                }
            ],
            settings: {
                title: 'Welcome to Github Groups !',
                color: '#FF0000',
                description: 'This is your first repository group !'
            }
        }
    ],
    settings: {
        theme: 'light'
    },
    tags: []
};

export const presetColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];
