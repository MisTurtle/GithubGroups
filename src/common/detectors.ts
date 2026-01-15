import { utils } from "github-url-detection";
import type { RepositorySource } from "./types";


type DetectorParameters = {
    checkRepo?: boolean;
};

interface Detector
{
    qualifier: RepositorySource;
    detect(url: URL, params?: DetectorParameters): boolean;
}

class GithubDetector implements Detector
{
    qualifier: RepositorySource = "github";
    detect(url: URL, params: DetectorParameters = {}): boolean {
        const regex = /https?:\/\/(?:[^\/]*?)\.?github\.com\/?/gm;
        let valid = regex.test(url.href);

        if(params.checkRepo)
            valid &&= utils.getRepositoryInfo(url) !== undefined;

        return valid;
    }
}


export const detectors: Detector[] = [ 
    new GithubDetector()
];

/**
 * Detect if a link comes from a supported provider (e.g. github)
 * 
 * @param url The URL to detect
 * @returns A final link as well as a qualifier for the parsed source
 */
export default function detectSource(url: URL, params: DetectorParameters = { }): RepositorySource | null
{
    for(let detector of detectors)
    {
        const result = detector.detect(url, params);
        if(result) return detector.qualifier;
    }
    return null;
}
