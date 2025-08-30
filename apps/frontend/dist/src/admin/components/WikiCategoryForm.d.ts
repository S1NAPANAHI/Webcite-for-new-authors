import React from 'react';
type WikiCategoryFormProps = {
    onSuccess: (category: any) => void;
    onCancel: () => void;
    initialData?: {
        name: string;
        description?: string;
    };
};
declare const WikiCategoryForm: React.FC<WikiCategoryFormProps>;
export default WikiCategoryForm;
//# sourceMappingURL=WikiCategoryForm.d.ts.map