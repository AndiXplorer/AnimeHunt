import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const Guest = () => {
  return (
    <div>
      <Outlet />
      <Footer />
    </div>
  );
};
