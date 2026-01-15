import { useEffect } from "react";
import type { RepositorySource } from "../../common/types";
import detectSource, { detectors } from "../../common/detectors";

function validateRepositoryUrl(urlString: string): { isValid: boolean; source: RepositorySource | null; error: string | null } {
    if (!urlString.trim()) {
        return { isValid: false, source: null, error: null };
    }

    let url: URL;
    try {
        url = new URL(urlString.trim());
    } catch {
        return { isValid: false, source: null, error: "Invalid URL format. Please enter a valid URL." };
    }

    const source = detectSource(url, { checkRepo: true });
    if (!source) {
        const supportedSources = detectors.map(d => `'${d.qualifier}'`).join(", ");
        return { isValid: false, source: null, error: `Invalid repository source. Make sure you are linking a repository from any of the supported sources (${supportedSources})` };
    }

    return { isValid: true, source, error: null };
}

interface RepositoryFormProps {
    url: string;
    setUrl: (url: string) => void;
    setSource: (source: RepositorySource | null) => void;
    onCancel: () => void;
    onSubmit: () => void;
    submitLabel: string;
    autoFocus?: boolean;
}

export function RepositoryForm({
    url,
    setUrl,
    setSource,
    onCancel,
    onSubmit,
    submitLabel,
    autoFocus = false
}: RepositoryFormProps) {
    const validation = validateRepositoryUrl(url);
    
    // Update source when URL changes
    useEffect(() => {
        setSource(validation.source);
    }, [url, validation.source, setSource]);

    const isButtonDisabled = !url.trim() || !validation.isValid;

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">
                    Repository URL
                    {validation.source && (
                        <code className="ml-2 px-1.5 py-0.5 text-xs font-mono bg-gray-200 dark:bg-gray-700 rounded">
                            {validation.source}
                        </code>
                    )}
                </label>
                {validation.error && (
                    <p className="text-red-500 text-sm mb-2">{validation.error}</p>
                )}
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 ${
                        validation.error 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'dark:border-gray-600 focus:ring-blue-500'
                    }`}
                    autoFocus={autoFocus}
                />
            </div>
            <div className="flex gap-2 pt-2">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={isButtonDisabled}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}

// Backwards compatible exports
export function AddRepositoryForm({
    newRepoUrl,
    setNewRepoUrl,
    setNewRepoSource,
    onCancel,
    onAdd
}: {
    newRepoUrl: string;
    setNewRepoUrl: (url: string) => void;
    setNewRepoSource: (source: RepositorySource | null) => void;
    onCancel: () => void;
    onAdd: () => void;
}) {
    return (
        <RepositoryForm
            url={newRepoUrl}
            setUrl={setNewRepoUrl}
            setSource={setNewRepoSource}
            onCancel={onCancel}
            onSubmit={onAdd}
            submitLabel="Add"
            autoFocus
        />
    );
}

export function EditEntryForm({
    entryUrl,
    setEntryUrl,
    setEntrySource,
    onCancel,
    onSave
}: {
    entryUrl: string;
    setEntryUrl: (url: string) => void;
    setEntrySource: (source: RepositorySource | null) => void;
    onCancel: () => void;
    onSave: () => void;
}) {
    return (
        <RepositoryForm
            url={entryUrl}
            setUrl={setEntryUrl}
            setSource={setEntrySource}
            onCancel={onCancel}
            onSubmit={onSave}
            submitLabel="Save"
        />
    );
}
