import { TimelineEvent } from '@zoroaster/shared/types/timeline';
interface TimelineEventFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event: TimelineEvent | null;
    onSuccess: () => void;
}
export default function TimelineEventForm({ open, onOpenChange, event, onSuccess, }: TimelineEventFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TimelineEventForm.d.ts.map