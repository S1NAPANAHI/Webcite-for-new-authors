import { Mark } from '@tiptap/core';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        spoiler: {
            toggleSpoiler: () => ReturnType;
        };
    }
}
export declare const Spoiler: Mark<any, any>;
//# sourceMappingURL=SpoilerExtension.d.ts.map