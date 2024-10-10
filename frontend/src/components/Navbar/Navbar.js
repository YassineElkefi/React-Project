import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token){
        setIsAuthenticated(true)
    }
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Profile', path: '/profile' },
    ...(!isAuthenticated
        ? [
            { name: 'Login', path: '/login' },
            { name: 'Register', path: '/register' },
          ]
        : []),
  ];

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-green-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-green-100 text-lg">L O G O</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`py-2 px-3 text-green-100 font-medium rounded-full hover:bg-green-700 transition duration-300 ${
                  location.pathname === item.path ? 'bg-green-600' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                className="py-2 px-3 text-green-100 font-medium rounded-full hover:bg-green-700 transition duration-300 bg-red-800"
                onClick={logout}
              >
                Logout
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="outline-none mobile-menu-button">
              <svg
                className="w-6 h-6 text-green-100 hover:text-green-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block py-2 px-4 text-sm text-green-100 hover:bg-green-700 ${
              location.pathname === item.path ? 'bg-green-600' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>
        ))}
        {isAuthenticated && (
          <button
            className="block py-2 px-4 text-sm text-green-100 hover:bg-green-700 bg-red-800"
            onClick={() => {
              setIsOpen(false);
              logout(); 
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;