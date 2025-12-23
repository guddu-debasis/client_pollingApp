import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BarChart2, LogOut, Plus, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                    <div className="p-1.5 bg-blue-600 rounded-lg">
                        <BarChart2 className="text-white" size={24} />
                    </div>
                    <span className="tracking-tight">PollMaster</span>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/create" className="btn btn-primary py-2 px-4 flex items-center gap-2">
                                <Plus size={18} />
                                <span className="hidden sm:inline">Create Poll</span>
                            </Link>
                            <div className="h-6 w-px bg-white/10"></div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
                                        <User size={16} />
                                    </div>
                                    <span className="hidden md:inline">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">Login</Link>
                            <Link to="/register" className="btn btn-primary py-2 px-6">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
