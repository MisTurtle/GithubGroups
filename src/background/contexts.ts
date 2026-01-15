const handleOnPageClick = (info: any, tab: any) => {
    console.log("PAGE");
    console.log("Context Info:", info);
    console.log("Context Tab:", tab);
};

const handleOnSelectionClick = (info: any, tab: any) => {
    console.log("SELECTION");
    console.log("Context Info:", info);
    console.log("Context Tab:", tab);
};

const handleOnLinkClick = (info: any, tab: any) => {
    console.log("LINK");
    console.log("Context Info:", info);
    console.log("Context Tab:", tab);
};

export function setup_context_menus()
{
    chrome.contextMenus.create({
        id: 'some-id-page',
        title: "New Menu Option - PAGE",
        contexts: [ "page" ]
    });
    
    chrome.contextMenus.create({
        id: 'some-id-selection',
        title: "New Menu Option - SELECTION",
        contexts: [ "selection" ]
    });
    
    chrome.contextMenus.create({
        id: 'some-id-link',
        title: "New Menu Option - LINK",
        contexts: [ "link" ],
        targetUrlPatterns: [ "*://*/*.torrent" ]
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
        const { menuItemId } = info;
        if(menuItemId === 'some-id-page') handleOnPageClick(info, tab);
        else if(menuItemId === 'some-id-selection') handleOnSelectionClick(info, tab);
        else if(menuItemId === 'some-id-link') handleOnLinkClick(info, tab);
    });
}