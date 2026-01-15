import { default_user_profile, user_profile_storage_key } from "./constants";
import type { UserProfile } from "./types";


export async function load_user_profile()
{
    const storage = await chrome.storage.local.get([ user_profile_storage_key ]);
    const json_profile = storage[user_profile_storage_key];
    if(!json_profile) return default_user_profile;
    try{
        return JSON.parse(json_profile as string) as UserProfile;
    }catch{
        return default_user_profile;
    }
}

export async function save_user_profile(profile: UserProfile)
{
    await chrome.storage.local.set({ [user_profile_storage_key]: JSON.stringify(profile) });
}