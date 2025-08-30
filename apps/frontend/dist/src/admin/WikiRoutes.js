import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import { WikiManager, WikiEditor } from '@zoroaster/ui';
import { WikiCategoryManager } from './components/WikiCategoryManager';
export const WikiRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(WikiManager, {}) }), _jsx(Route, { path: "new", element: _jsx(WikiEditor, {}) }), _jsx(Route, { path: "edit/:id", element: _jsx(WikiEditor, {}) }), _jsx(Route, { path: "categories", element: _jsx(WikiCategoryManager, {}) })] }));
};
export default WikiRoutes;
//# sourceMappingURL=WikiRoutes.js.map