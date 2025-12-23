import { useState, useEffect } from 'react';
import api from '../api/axios';
import PollCard from '../components/PollCard';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const { data } = await api.get('/polls');
                setPolls(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolls();
    }, []);

    if (loading) return <div className="flex-center h-[50vh]"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

    return (
        <div className="container fade-in">
            <header className="mb-8 text-center">
                <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', backgroundImage: 'linear-gradient(to right, #60a5fa, #c084fc)' }}>Live Polls</h1>
                <p className="text-lg">Vote on trending topics or create your own!</p>
            </header>

            {polls.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                    <p>No polls available yet. Be the first to create one!</p>
                </div>
            ) : (
                <div className="grid-polls">
                    {polls.map((poll, index) => (
                        <motion.div
                            key={poll._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <PollCard poll={poll} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
