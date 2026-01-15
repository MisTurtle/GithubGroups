/// <reference types="chrome" />

import { setup_context_menus } from "./contexts";
import { welcomed_shown_storage_key } from "../common/constants";

async function show_welcome_page()
{
    const storage = await chrome.storage.local.get([ welcomed_shown_storage_key ]);
    const welcomed = storage[welcomed_shown_storage_key] ?? false;
    if(welcomed) return;

    try{
        const url = chrome.runtime.getURL("pages/welcome.html");
        await chrome.tabs.create({ url: url });
    }finally{
        await chrome.storage.local.set({ [welcomed_shown_storage_key]: true });
    }
}

export default chrome.runtime.onInstalled.addListener(async () => {
    await show_welcome_page();
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    setup_context_menus();
});
