import { Tables } from '../database.types';
type BetaApplication = Tables<'beta_applications'>;
export declare const useBetaApplications: () => {
    applications: {
        answers: import("../database.types").Json | null;
        applicant_email: string;
        created_at: string | null;
        id: string;
        status: string | null;
        updated_at: string | null;
    }[];
    loading: boolean;
    error: string;
    fetchApplications: () => Promise<void>;
    updateApplicationStatus: (id: string, newStatus: BetaApplication["status"], notes: string) => Promise<boolean>;
    updateAdminNotes: (appId: string, newNotes: string) => Promise<boolean>;
};
export {};
//# sourceMappingURL=useBetaApplications.d.ts.map