import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true); // toggle form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

useEffect(() => {
  if (localStorage.getItem('token')) {
    navigate('/dashboard');
  }
}, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isSignup
      ? 'http://localhost:8080/auth/signup'
      : 'http://localhost:8080/auth/login';


    try {

  const payload = isSignup
  ? { username, email, password } // include username during signup
  : { email, password };   

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      console.log(result);

      if (res.ok) {
        setMessage(`${isSignup ? 'Signup' : 'Login'} successful!`);
        localStorage.setItem('token', result.token); // Store token if needed
        console.log("Token: " + result.token);
        navigate('/dashboard');
      } else {
        setMessage(result.message || 'Authentication failed');
        toast.error(result.message);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Something went wrong.');
    }
  };

  return (
<div className="p-6 max-w-md mx-auto mt-12 bg-white rounded shadow">
  <h2 className="text-2xl font-bold mb-4 text-center">
    {isSignup ? 'Sign Up' : 'Login'}
  </h2>

  {message && <p className="text-center text-sm mb-3 text-blue-500">{message}</p>}

  <form onSubmit={handleAuth} className="space-y-4">

    {/* ✅ Show username input only in Sign Up mode */}
    {isSignup && (
      <input
        type="text"
        placeholder="Username"
        className="border w-full p-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
    )}

    <input
      type="text"
      placeholder="Email"
      className="border w-full p-2"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Password"
      className="border w-full p-2"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full rounded">
      {isSignup ? 'Sign Up' : 'Login'}
    </button>
  </form>

  <p className="text-center mt-4 text-sm">
    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
    <button
      className="text-blue-600 underline"
      onClick={() => {
        setMessage('');
        setIsSignup(!isSignup);
      }}
    >
      {isSignup ? 'Login' : 'Sign Up'}
    </button>
  </p>
</div>

  );
};

export default AuthPage;