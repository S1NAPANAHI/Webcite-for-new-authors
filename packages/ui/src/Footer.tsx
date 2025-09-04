import React from 'react';
import styles from './Footer.module.css';
import { Twitter, Instagram, Mail } from 'lucide-react'; // Import Lucide icons

export const Footer = () => {
  return (
    <footer className={styles.zoroFooter}>
      <div className={styles.footerContent}>
        <div className={styles.footerColumns}>
          <div className={styles.column}>
            <h4>Zoroasterverse</h4>
            <p>“Truth is the architect of happiness.”</p>
            <p>© {new Date().getFullYear()} Zoroasterverse. All rights reserved.</p>
          </div>
          <div className={styles.column}>
            <h4>Explore</h4>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/books">Books</a></li>
              <li><a href="/artist-collaboration">Artist Collaboration</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className={styles.column}>
            <h4>Connect</h4>
            <ul className={styles.socialIcons}>
              <li><a href="#"><Twitter /></a></li>
              <li><a href="#"><Instagram /></a></li>
              <li><a href="#"><Mail /></a></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerQuote}>
          <em>“Let your conscience be the altar where right intention dwells.”</em>
        </div>
      </div>
    </footer>
  );
};