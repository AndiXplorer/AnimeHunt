import { createBrowserRouter } from 'react-router-dom';
import { Guest } from './Layout/Guest';
import { HomePage } from './Pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Guest />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
]);

export default router;
