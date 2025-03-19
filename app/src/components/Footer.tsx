import styles from './style.module.less';
import coffee from '../assets/coffee.svg';
import heart from '../assets/Heart.svg';
import { useEffect, useState } from 'react';

export const Footer = () => {
  const [showFooter, setShowFooter] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFooter(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!showFooter) {
    return null;
  }

  return (
    <div className={styles.footer}>
      <div className={styles.made}>
        <p>
          Made with
          <img src={heart} alt="Heart Icon" />
          and
          <img src={coffee} alt="Coffee Icon" />
        </p>
      </div>
      <div className={styles.support}>
        <p>Support</p>
        <p>
          <a href="https://github.com/AndiXplorer/AnimeHunt" target="_blank">
            Contribute
          </a>
        </p>
      </div>
    </div>
  );
};
