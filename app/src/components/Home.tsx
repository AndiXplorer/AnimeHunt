import styles from './style.module.less';
import logo from '../assets/AnimeHunt logo.svg';
import { FaSearch } from 'react-icons/fa';

export const Home = () => {
  return (
    <div className={styles.content}>
      <div className={styles.searchBar}>
        <img src={logo} alt="Anime Hunt" />
        <div className={styles.inputWrapper}>
          <FaSearch className={styles.icon} />
          <input
            type="text"
            placeholder="Paste the link to download any Anime"
          />
        </div>
      </div>
    </div>
  );
};
