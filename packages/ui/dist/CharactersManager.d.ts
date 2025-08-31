import { default as React } from 'react';
type Character = {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    title: string;
    description: string;
    traits: string[];
    image_url?: string;
    silhouette_url?: string;
};
interface CharacterEditorProps {
    character: Character | null;
    onSave: (character: Character) => void;
    onCancel: () => void;
}
export declare const CharacterEditor: React.FC<CharacterEditorProps>;
export declare const CharactersManager: React.FC;
export {};
//# sourceMappingURL=CharactersManager.d.ts.map