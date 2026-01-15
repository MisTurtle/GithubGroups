<h1 align="center"><img width="50" align="center" src="assets/github-groups-logo.svg"> GitHub Groups</h1> 

<p align="center">
    <strong>:tada: Finally sort your GitHub repositories into groups</strong>
</p>

<p align="center">
    <a href="https://github.com/MisTurtle/GithubGroups/stargazers"><img alt="GitHub Repo Stars" src="https://img.shields.io/github/stars/MisTurtle/GithubGroups?style=flat"></a>
    <a href="https://github.com/MisTurtle/GithubGroups/forks"><img alt="GitHub forks" src="https://img.shields.io/github/forks/MisTurtle/GithubGroups?style=flat"></a>
    <a href="https://github.com/MisTurtle/GithubGroups/issues"><img alt="Issues" src="https://img.shields.io/github/issues/MisTurtle/GithubGroups?logo=github&style=flat"></a>
    <a href="https://github.com/MisTurtle/GithubGroups/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/MisTurtle/GithubGroups?style=flat"></a>
    <a><img alt="Made with love" src="https://img.shields.io/badge/made_with-%F0%9F%92%96-white?style=flat"></a>
</p>


Have you ever dreamed of being able to sort your favorite repositories into cleanly labelled groups? 

How naive must you be to think this should be implemented by default... How would one even go about implementing such magic...

Oh, well, now you can with the **GitHub Groups** extension !

> **Disclaimer**
> This extension is in development and hasn't seen its first release yet. Hold tight, a bunch of features are coming in hot :hot_face:
> It will be deployed to the Google Chrome Web Store as soon as I feel it is ready enough ^^'

## :gear: Installation

Currently, the installation for this extension is very manual. This will get fixed once we go to the store:

1. Clone this repository
    `git clone https://github.com/MisTurtle/GithubGroups.git`

2. Enter the folder
    `cd GithubGroups`

3. Build the app (requires NodeJS, tested from v23.6.0+)
    `npm run build`

4. [Enable it in Google Chrome](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/)
    Go to chrome://extensions, enable Developper Mode, and click on "Load unpacked", and navigate to the cloned repository's `build` folder.

5. You should now see the extension. You can pin it and click on it to open the side panel !

## :fire: Shout out to the stack

The following technologies power this extension:

- :robot: React and TypeScript built with Vite
- :art: Tailwind CSS for styling
- :bulb: Amazing [Lucide]() icons
- :link: [GitHub URL Detection](https://github.com/refined-github/github-url-detection) node package to extract repository information

## :star2: Features

Currently, the extension allows to:

- :sparkles: Create and manage GitHub repositories into beautifully colored groups
- :label: Add tags to individual repositories

## Upcoming

A lot of features are coming to this extension:

- Extension Themes
- Profile Exports / Imports
- Actual Welcome and Settings pages
- Sorting repositories into groups ON GitHub profile pages
- GitHub repository group displays when linked on any page
- And a bunch more I probably haven't thought of yet !
