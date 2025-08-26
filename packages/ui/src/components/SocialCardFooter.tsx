import React, { useState } from 'react';
import { ArrowLeftCircle } from 'lucide-react'; // Only need this for overview
import styles from '../Footer.module.css';

const SocialCardFooter: React.FC = () => {
  const [activeCard, setActiveCard] = useState('overview');

  const handleCardToggle = (cardId: string) => {
    setActiveCard(cardId);
  };

  // Simplified getCardClass
  const getCardClass = (cardId: string) =>
    `${styles.card} ${styles[cardId]} ${activeCard === cardId ? styles.active : ''}`;

  return (
    <div className={styles.cards}>
      {/* Only Overview Card for testing */}
      <div className={getCardClass('overview')}>
        <a className={styles.cardToggle} onClick={() => handleCardToggle(activeCard === 'overview' ? '' : 'overview')}>
          <ArrowLeftCircle />
        </a>
        <div className={styles.cardContent}>
          <div className={styles.row}>
            <div className={`${styles.left} ${styles.col}`}>
              <h2>Personal <strong>Social Card</strong></h2>
              <p>This is a test of the clip-path animation.</p>
            </div>
            <div className={`${styles.right} ${styles.col}`}>
              {/* Placeholder for image */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCardFooter;
