import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Trash2, Send, Clock, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CreatePoll = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [duration, setDuration] = useState(60); // minutes
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 10) setOptions([...options, '']);
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validOptions = options.filter(o => o.trim() !== '');

        if (!question.trim() || validOptions.length < 2) {
            alert("Please provide a question and at least 2 options.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/polls', {
                question,
                options: validOptions,
                durationInMinutes: parseInt(duration)
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to create poll');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 max-w-xl fade-in pt-8">
            <div className="card">
                <h1 className="text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', backgroundImage: 'linear-gradient(to right, #60a5fa, #c084fc)' }}>Create New Poll</h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                            <AlignLeft size={16} /> Question
                        </label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="What do you want to ask?"
                            rows={3}
                            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-400">Options</label>
                        {options.map((option, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-1"
                                    required={index < 2}
                                />
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </motion.div>
                        ))}

                        {options.length < 10 && (
                            <button
                                type="button"
                                onClick={addOption}
                                className="btn btn-secondary w-full border-dashed border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
                            >
                                <Plus size={18} /> Add Option
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Clock size={16} /> Duration (Minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full"
                        />
                        <p className="text-xs text-gray-500 text-right">Poll will expire in {duration} minutes</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-4 text-lg mt-8"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Send size={20} /> Publish Poll
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePoll;
