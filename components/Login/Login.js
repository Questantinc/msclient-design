import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// import { BiSolidHide, BiSolidShow } from 'react-icons/bi';
import Logo from '../images/Logo.png'
import jwt_decode from 'jwt-decode';
import './Login.css'

function Login(props) {

  const {email, setEmail, password, setPassword} = props;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post('https://44.217.202.126/api/login', { email, password });

      if (response.status === 200) {
        const token = response.data.token;
        const refreshToken = response.data.refreshToken;
        const decodedToken = jwt_decode(token);
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(decodedToken));
        // alert('Authentication successful');
        props.onAuthentication(token);
        navigate('/Home');
      } else if (response.status === 404) {
        // Email not found
        alert('Email not found');
      } else if (response.status === 401) {
        // Password does not match
        alert('Password does not match');
      } else {
        // Other error
        alert('An error occurred during authentication');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      alert('An error occurred during authentication');
    }
  };

  useEffect(() => {
    const handleTokenExpiration = async () => {
      const token = localStorage.getItem('jwtToken');

      if (token) {
        const decodedToken = jwt_decode(token);

        if (Date.now() >= decodedToken.exp * 1000) {
          refreshAccessToken();
        }
      }
    };

    const refreshAccessToken = async () => {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post('https://44.217.202.126/api/refresh', { refreshToken });

          if (response.status === 200) {
            const newToken = response.data.token;
            const decodedToken = jwt_decode(newToken);
            localStorage.setItem('jwtToken', newToken);
            localStorage.setItem('userData', JSON.stringify(decodedToken));
          } else {
            console.error('Error refreshing access token:', response);
          }
        } catch (error) {
          console.error('Error refreshing access token:', error);
        }
      }
    };

    handleTokenExpiration();
  }, []);

          

  const validateEmail = (input) => {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(input);
  };

  return (

    <div>
      <nav className="navbar1">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Company Logo" />
          </Link>
        </div>
      </nav>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <h2>Login</h2>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="toggle-password-button"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
            <button className="submit-button" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div >
    </div >
  );
}

export default Login;
