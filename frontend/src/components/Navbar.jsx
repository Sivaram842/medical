import React, { useState } from "react";
import { Menu, ChevronDown, LogOut, User, Store, X, Phone, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';



const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);


    return (
        <nav className="sticky top-4 z-50 ">
            <div className="mx-auto max-w-7xl px-4">
                <div className="rounded-2xl border border-white/10 bg-[#0c0f17]/80 backdrop-blur-xl shadow-lg">
                    <div className="flex items-center justify-between px-4 py-3 md:px-6">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg" />
                            <div className="leading-tight">
                                <div className="text-lg font-bold text-white">MediFine</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-400">
                                    Local Medicine Services
                                </div>
                            </div>
                        </Link>

                        {/* Desktop links */}
                        <div className="hidden items-center gap-7 md:flex">
                            <Link to='/'>Home</Link>
                            <Link to='/about'>About</Link>
                            <div className="group relative">
                                <Link >Services ▾</Link>
                                {/* simple hover menu */}
                                <div className="invisible absolute left-0 top-full w-44 rounded-xl border border-white/10 bg-[#0c0f17] p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                                    <a href="/seo" className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">SEO</a>
                                    <a className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">SMM</a>
                                    <a className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">Content</a>
                                </div>
                            </div>
                            <div className="group relative">
                                <Link >Pages ▾</Link>
                                <div className="invisible absolute left-0 top-full w-44 rounded-xl border border-white/10 bg-[#0c0f17] p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                                    <a href="/appointment" className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">Appointment Request/Scheduling</a>
                                    <a href="/faqs" className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">FAQs</a>
                                    <a href="/reviews" className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">Testimonials/Reviews</a>
                                </div>
                            </div>
                            <Link to='/blog-news'>Blog/News</Link>
                            <Link to='/contactus'>Contact Us</Link>
                        </div>

                        {/* Right actions */}
                        <div className="hidden items-center gap-3 md:flex">
                            <Link
                                to="/search"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
                                aria-label="Search"
                            >
                                <Search className="h-4 w-4 text-gray-300" />
                            </Link>

                            <button className="flex h-10 items-center gap-2 rounded-full border border-violet-500/30 bg-violet-600/20 px-3 text-sm font-medium text-white hover:bg-violet-600/30">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600">
                                    <Phone className="h-4 w-4" />
                                </span>
                                <span className="pr-1">+91 9032488161</span>
                            </button>
                            <div className="flex items-center gap-4">




                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowMenu(!showMenu)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        >
                                            <User className="w-5 h-5 dark:text-gray-300" />
                                            <span className="text-sm font-medium dark:text-white">{user.user?.name}</span>
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

                        {/* Mobile */}
                        <button
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
                            onClick={() => setOpen((s) => !s)}
                            aria-label="Toggle menu"
                        >
                            {open ? (
                                <X className="h-5 w-5 text-white" />
                            ) : (
                                <Menu className="h-5 w-5 text-white" />
                            )}
                        </button>
                    </div>

                    {/* Mobile menu */}
                    {open && (
                        <div className="border-t border-white/10 p-3 md:hidden">
                            <div className="grid gap-1">
                                <Link to='/'>Home</Link>
                                <Link to='/about'>About</Link>
                                <Link to='/services'>Services</Link>
                                <Link to='/pages'>Pages</Link>
                                <Link to='/blog-news'>Blog/News</Link>
                                <Link to='/contactus'>Contact Us</Link>
                                <div className="mt-2 flex items-center gap-2">
                                    <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10">
                                        <Search className="h-4 w-4 text-gray-300" />
                                    </button>
                                    <button className="flex h-10 flex-1 items-center gap-2 rounded-full border border-violet-500/30 bg-violet-600/20 px-3 text-sm font-medium text-white hover:bg-violet-600/30">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600">
                                            <Phone className="h-4 w-4" />
                                        </span>
                                        <span className="pr-1">+91 9032488161</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
