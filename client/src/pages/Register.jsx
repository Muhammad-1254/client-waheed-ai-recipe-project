import  { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiRoutes } from '../utils/apiRoutes';


const userInitialState = {username:"usman", email: 'usman@gmail.com', password: '12345678' }

function Register() {
  const [user, setUser] = useState(userInitialState);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(apiRoutes.signup, {
        username: user.username,
        email: user.email,
        password: user.password
      });
      console.log("signup response:", res.data);
      navigate('/login');
    } catch (error) {
      alert('Registration failed');
      console.error(error);
    }
  };
  

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="auth-form"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Join Us!</h2>
        <p>Fill in your details to create an account</p>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              required
              value={user.username}
              onChange={(e) => setUser({...user,username:e.target.value})}
            />
            <label className="placeholder">Enter username</label>
          </div>
          <div className="input-container">
            <input
              type="email"
              required
              value={user.email}
              onChange={(e) => setUser({...user,email:e.target.value})}
            />
            <label className="placeholder">Enter email</label>
          </div>
          <div className="input-container">
            <input
              type="password"
              required
              value={user.password}
              onChange={(e) => setUser({...user,password:e.target.value})}
            />
            <label className="placeholder">Password</label>
          </div>
          <button className="auth-button">Register</button>
        </form>
        {/* <div className="social-login">
          <button className="google-button">
            <FaGoogle className="google-icon" /> Continue with Google
          </button>
        </div> */}
        <p>Already a member? <a href="/login" className="login-link">Login now</a></p>
      </motion.div>
    </motion.div>
  );
}

export default Register;
