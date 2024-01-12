import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../styles/Login.css"
import { useUser } from '../context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:3001/login', {
  //       username,
  //       password,
  //     });

  //     toast.success(response.data.message);
  //     // Handle successful login, e.g., redirect to dashboard
  //   } catch (error) {
  //     toast.error(error.response?.data.error || 'An error occurred');
  //   }
  // };
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${window.location.origin}/login`, {
        username,
        password,
      });
      console.log('Login response:', response);

      // Assuming the server returns user data upon successful login
      // const userData = response.data;
      // navigate('/portfolio');

      // login(userData.user);
  
      // toast.success(response.data.message);
      if (response.data.user) {
        // Assuming your backend returns the user data
        login(response.data.user);
              navigate('/portfolio');

        toast.success('Login successful!');
      } else {
        // Handle the case where the user data is not available in the response
        toast.error('User data not found in the response');
      }
      // Handle successful login, e.g., redirect to dashboard
    } catch (error) {
      toast.error(error.response?.data.error || 'An error occurred');
    }
  };

  return (
    <div class="login-container">
      <h2>Login</h2>
      <form class="login-form">
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
    

  );
};

export default Login;
