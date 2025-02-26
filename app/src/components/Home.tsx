import styles from './style.module.less';
import logo from '../assets/AnimeHunt logo.svg';
import { FaDownload, FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';

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
  const [url, setUrl] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [readyDownload, setReadyDownload] = useState<boolean>(false);
  const [downloadUrls, setDownloadUrls] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value);
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (e.key === 'Enter') {
      try {
        setLoader(true);
        const response: ApiResponse = await axios.post(
          'http://localhost:5000/extract',
          { url },
        );

        if (response.data) {
          const urls = response.data.map(
            (item: { request_url: string }) => item.request_url,
          );
          setDownloadUrls(urls);
        }

        setLoader(false);
        setReadyDownload(true);
      } catch (error) {
        const err = error as ErrorResponse;
        console.error('Error:', err.response ? err.response.data : err.message);
        setLoader(false);
      }
    }
  };

  return (
    <div className={styles.content}>
      {loader && (
        <div className={styles.theLoader}>
          <div className={styles.loader}></div>
        </div>
      )}
      {!readyDownload && (
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
      )}

      {readyDownload && (
        <div className={styles.downloadButtons}>
          {downloadUrls.map((url, index) => (
            <div key={index} className={styles.downloadButton}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <button>
                  <FaDownload />
                  {`Link ${index + 1}`}
                </button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
