import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';

const PollCard = ({ poll }) => {
    const isExpired = new Date(poll.expiresAt) < new Date();
    const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    };

    return (
        <Link to={`/poll/${poll._id}`} className="block relative group">
            <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 rounded-2xl" />
            <div className="relative card h-full border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-6 flex flex-col hover:border-blue-500/50 transition-all duration-300">
                <div className={`absolute top-4 right-4 px-2.5 py-1 text-xs font-bold rounded-full border ${isExpired ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                    {isExpired ? 'Ended' : 'Active'}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 pr-16 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {poll.question}
                </h3>

                <div className="mt-auto pt-4 flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5" title="Creator">
                            <User size={14} className="text-slate-500" />
                            {poll.createdBy?.name || 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-1.5" title="Expires">
                            <Clock size={14} className="text-slate-500" />
                            {formatDate(poll.expiresAt)}
                        </span>
                    </div>
                    <span className="font-semibold text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-md">
                        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default PollCard;
