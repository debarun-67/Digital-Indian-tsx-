import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import logo from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Industries', href: '/industries' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and company info group */}
          <Link to="/" className="flex items-start space-x-2">
            <img src={logo} alt="Digital Indian Logo" className="h-10 w-auto" />
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                <span className="text-orange-500">DIGITAL</span>
                <span className="text-green-500 ml-1">INDIAN</span>
              </span>
              <span className="text-xs text-gray-900 dark:text-gray-200 font-medium">transforming new india</span>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">www.digitalindian.co.in</span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <Link
              to="/contact"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Get Quote
            </Link>

            {/* Dark mode toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile menu button and toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </button>
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col items-center mb-4">
              <span className="text-xl font-bold">
                <span className="text-orange-500">DIGITAL</span>
                <span className="text-green-500 ml-1">INDIAN</span>
              </span>
              <span className="text-sm text-gray-600 font-medium mt-1">transforming new india</span>
              <span className="text-sm text-gray-600 font-medium mt-1">www.digitalindian.co.in</span>
            </div>
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium px-4 py-2 rounded transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors mx-4 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;