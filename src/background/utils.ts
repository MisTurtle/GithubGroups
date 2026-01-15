import { user_profile_storage_key } from "../common/constants";
import type { UserProfile } from "../common/types";

export async function save_user_profile(profile: UserProfile)
{
    await chrome.storage.local.set({ [user_profile_storage_key]: JSON.stringify(profile) });
}