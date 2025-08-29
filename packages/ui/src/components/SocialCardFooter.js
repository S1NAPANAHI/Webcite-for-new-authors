import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ArrowLeftCircle } from 'lucide-react'; // Only need this for overview
import styles from '../Footer.module.css';
const SocialCardFooter = () => {
    const [activeCard, setActiveCard] = useState('overview');
    const handleCardToggle = (cardId) => {
        setActiveCard(cardId);
    };
    // Simplified getCardClass
    const getCardClass = (cardId) => `${styles.card} ${styles[cardId]} ${activeCard === cardId ? styles.active : ''}`;
    return (_jsx("div", { className: styles.cards, children: _jsxs("div", { className: getCardClass('overview'), children: [_jsx("a", { className: styles.cardToggle, onClick: () => handleCardToggle(activeCard === 'overview' ? '' : 'overview'), children: _jsx(ArrowLeftCircle, {}) }), _jsx("div", { className: styles.cardContent, children: _jsxs("div", { className: styles.row, children: [_jsxs("div", { className: `${styles.left} ${styles.col}`, children: [_jsxs("h2", { children: ["Personal ", _jsx("strong", { children: "Social Card" })] }), _jsx("p", { children: "This is a test of the clip-path animation." })] }), _jsx("div", { className: `${styles.right} ${styles.col}` })] }) })] }) }));
};
export default SocialCardFooter;
