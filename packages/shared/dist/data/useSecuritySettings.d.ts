export declare const useSecuritySettings: () => {
    loading: boolean;
    error: string | null;
    success: string | null;
    activeSessions: any[];
    securityEvents: any[];
    changePassword: (newPassword: string) => Promise<{
        success: boolean;
        error?: never;
    } | {
        success: boolean;
        error: any;
    }>;
    enableTwoFactor: () => Promise<{
        success: boolean;
        error?: never;
    } | {
        success: boolean;
        error: any;
    }>;
    disableTwoFactor: () => Promise<{
        success: boolean;
        error?: never;
    } | {
        success: boolean;
        error: any;
    }>;
    revokeSession: (sessionId: string) => Promise<{
        success: boolean;
        error?: never;
    } | {
        success: boolean;
        error: any;
    }>;
    fetchActiveSessions: () => Promise<{
        success: boolean;
        data: {
            id: string;
            device: string;
            location: string;
            ip: string;
            lastActive: string;
            current: boolean;
        }[];
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
    fetchSecurityEvents: () => Promise<{
        success: boolean;
        data: {
            id: string;
            type: string;
            description: string;
            device: string;
            ip: string;
            timestamp: string;
            status: string;
        }[];
        error?: never;
    } | {
        success: boolean;
        error: any;
        data?: never;
    }>;
};
//# sourceMappingURL=useSecuritySettings.d.ts.map