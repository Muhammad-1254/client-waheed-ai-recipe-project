import  { useContext, useState } from 'react';
import { FaGoogle } from "react-icons/fa";
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiRoutes } from '../utils/apiRoutes';
import { UserContext } from '../store/user';

const userInitialState = {
  email:"usman@gmail.com",
  password:"12345678"
}

function Login() {
  const [user,setUser] = useState(userInitialState) 
  const { setUser:setGlobalUser} = useContext(UserContext)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {

    const res =   await axios.post(apiRoutes.login, {
        email: user.email,
        password:user.password
      },{withCredentials:true});
      console.log("login response:",res.data);
      if(res.status === 200){
        const data = res.data.data
        setGlobalUser((prev)=>({...prev,
          userId: data.user._id,
          username: data.user.username,
          email: data.user.email,
          isAuth: true,
        }))
      }
      navigate('/');
    } catch (error) {
      alert('Login failed');
      console.error("error while login:",error);
    }
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.form
        className="auth-form"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
      >
        <h2>Hello Again!</h2>
        <p>Welcome back you've been missed!</p>
        <div className="input-container">
          <input
            type="email"
            
            required
            value={user.email}
            onChange={(e) => setUser({...user,email:e.target.value})}
          />
          <label className="placeholder">Enter email </label>
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
        <button className="auth-button" type="submit">Sign In</button>
        <div className="recovery-password">Recovery Password</div>
        {/* <div className="social-login">
          <button className="google-button">
            <FaGoogle className="google-icon" /> Continue with Google
          </button>
        </div> */}
        <div className="auth-footer">
          <span>Don't have an account? </span>
          <a href="/register" className="register-link">Register</a>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default Login;
