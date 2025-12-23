import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePoll from './pages/CreatePoll';
import PollDetails from './pages/PollDetails';

function App() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '80vh' }} className="pt-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<PollDetails />} />
        </Routes>
      </div>
      <footer className="py-8 text-center text-gray-600 text-sm">
        <p>© 2024 PollMaster. Built with React & Node.js.</p>
      </footer>
    </>
  );
}

export default App;
