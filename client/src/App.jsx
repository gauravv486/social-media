import { useEffect, useMemo } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import useAuthStore from './store/authStore.js';
import UserProfile from './components/UserProfile.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f3f2ef' }}>
        <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: '#0a66c2' }} />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f3f2ef' }}>
        <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: '#0a66c2' }} />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Feed />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/profile/:username",
    element: <ProtectedRoute> <UserProfile /></ProtectedRoute>
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
          <a href="/" className="text-blue-600 hover:underline">Go Home</a>
        </div>
      </div>
    ),
  },
];

const router = createBrowserRouter(routes);

function App() {

  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
