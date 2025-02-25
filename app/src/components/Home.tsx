import styles from './style.module.less';
import logo from '../assets/AnimeHunt logo.svg';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios'; // Import axios

interface ApiResponse {
  data: any;
}

interface ErrorResponse {
  response?: {
    data: any;
  };
  message: string;
}

export const Home = () => {
  const [url, setUrl] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value);
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (e.key === 'Enter') {
      try {
        const response: ApiResponse = await axios.post(
          'http://localhost:5000/extract',
          { url },
        );

        console.log('Data from server:', response.data);
      } catch (error) {
        const err = error as ErrorResponse;
        console.error('Error:', err.response ? err.response.data : err.message);
      }
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.searchBar}>
        <img src={logo} alt="Anime Hunt" />
        <div className={styles.inputWrapper}>
          <FaSearch className={styles.icon} />
          <input
            type="text"
            placeholder="Paste the link to download any Anime"
            value={url}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};
