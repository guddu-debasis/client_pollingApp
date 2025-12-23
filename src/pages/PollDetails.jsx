import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PollDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [poll, setPoll] = useState(null);
    const [socket, setSocket] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.emit('join_poll', id);

        newSocket.on('poll_update', (updatedPoll) => {
            setPoll(updatedPoll);
        });

        newSocket.on('vote_error', ({ message }) => {
            setError(message);
            setTimeout(() => setError(''), 3000);
        });

        // Initial fetch
        api.get(`/polls/${id}`)
            .then(({ data }) => setPoll(data))
            .catch((err) => {
                console.error(err);
                navigate('/');
            });

        return () => newSocket.close();
    }, [id, navigate]);

    const handleVote = (index) => {
        if (!user) {
            navigate('/login');
            return;
        }
        const token = localStorage.getItem('token');
        socket.emit('vote', { pollId: id, optionIndex: index, token });
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this poll?")) return;
        try {
            await api.delete(`/polls/${id}`);
            navigate('/');
        } catch (err) {
            alert('Failed to delete poll');
        }
    };

    if (!poll) return <div className="flex-center h-[50vh]"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

    const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
    const isExpired = new Date(poll.expiresAt) < new Date();
    const isCreator = user && poll.createdBy && (typeof poll.createdBy === 'object' ? poll.createdBy._id === user.id : poll.createdBy === user.id);

    return (
        <div className="container mx-auto px-4 max-w-2xl fade-in pt-12">
            {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded text-red-200 text-center">
                    {error}
                </div>
            )}

            <div className="card">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold leading-tight">{poll.question}</h1>
                    {isCreator && (
                        <button onClick={handleDelete} className="btn btn-danger p-2" title="Delete Poll">
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
                    <span className={`px-2 py-1 rounded ${isExpired ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                        {isExpired ? 'Ended' : 'Live'}
                    </span>
                    <span>Expires: {new Date(poll.expiresAt).toLocaleString()}</span>
                </div>

                <div className="space-y-4">
                    {poll.options.map((option, index) => {
                        const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);

                        return (
                            <motion.button
                                key={index}
                                whileHover={!isExpired ? { scale: 1.02 } : {}}
                                whileTap={!isExpired ? { scale: 0.98 } : {}}
                                onClick={() => !isExpired && handleVote(index)}
                                disabled={isExpired}
                                className={`relative w-full text-left p-4 rounded-xl border border-gray-700 overflow-hidden transition-colors ${isExpired ? 'cursor-default opacity-80' : 'hover:border-blue-500 cursor-pointer bg-slate-800/50'
                                    }`}
                            >
                                {/* Background Progress Bar */}
                                <div
                                    className="absolute top-0 left-0 bottom-0 bg-blue-500/20 transition-all duration-500 ease-out"
                                    style={{ width: `${percentage}%` }}
                                />

                                <div className="relative flex justify-between items-center z-10">
                                    <span className="font-medium text-lg">{option.text}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-400">{option.votes} votes</span>
                                        <span className="font-bold text-blue-400 w-12 text-right">{percentage}%</span>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    Total Votes: {totalVotes}
                </div>
            </div>
        </div>
    );
};

export default PollDetails;
