import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './components/auth/register';
import Login from './components/auth/login';
import Profile from './components/Profile/Profile';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import OtherUserProfile from './components/otherUserProfile/otherUserProfile';
import Notifications from './components/Notifications/Notifications';


const NavbarWrapper = () => {
  const location = useLocation();
  const noNavbarPaths = ['/login', '/register'];
  return !noNavbarPaths.includes(location.pathname) ? <Navbar /> : null;
};

function App() {
  return (
    <Router>
      <NavbarWrapper />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:userId" element={<OtherUserProfile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;
