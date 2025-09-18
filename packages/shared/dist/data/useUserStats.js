import { useState } from 'react';
export const useUserStats = (_userId) => {
    const [userStats] = useState(null);
    const [loading] = useState(false);
    const [error] = useState(null);
    return { userStats, loading, error };
};
//# sourceMappingURL=useUserStats.js.map