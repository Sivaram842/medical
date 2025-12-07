import React, { useState } from 'react';
import { Moon, Sun, ChevronDown, LogOut, User, Store, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Pill className="w-8 h-8 text-indigo-600" />
                    <span className="text-xl font-bold dark:text-white">PharmFind</span>
                </Link>

                <div className="flex items-center gap-4">


                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <User className="w-5 h-5 dark:text-gray-300" />
                                <span className="text-sm font-medium dark:text-white">{user.name}</span>
                                <ChevronDown className="w-4 h-4 dark:text-gray-400" />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-800 py-2">
                                    <Link to="/pharmacies" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
                                        <Store className="w-4 h-4" /> My Pharmacies
                                    </Link>
                                    <Link to="/account" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
                                        <User className="w-4 h-4" /> Account
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600">
                                Login
                            </Link>
                            <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
