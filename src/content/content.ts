
import { user_profile_storage_key } from "../common/constants";
import type { UserProfile } from "../common/types";
import { load_user_profile } from "../common/user_profile";



function updateLinks(profile: UserProfile)
{
    profile;
    // const links = document.querySelectorAll("a");


    // links.forEach(link => {
    //     if(link.href)
    // });
}

export default window.onload = () => {

    chrome.storage.local.onChanged.addListener((changes) => {
        const newProfileJson = changes[user_profile_storage_key];
        if(!newProfileJson) return;

        const newProfile = JSON.parse(newProfileJson as string);
        updateLinks(newProfile);
    });

    load_user_profile().then(updateLinks);

    console.log("---> CHROME EXTENSION");
    const element = document.createElement("h1");
    
    element.style.color = "red";
    element.style.position = "absolute";
    element.style.top = '0';
    element.style.left = '0';
    element.textContent = "Hello there !";

    document.body.appendChild(element);
};