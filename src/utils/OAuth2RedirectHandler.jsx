import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
     const timeout = setTimeout(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username');

    if(username)
        localStorage.setItem('username', username);

    console.log("Token received after delay:", token);

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      navigate('/login?error=true');
    }
  }, 100);

  return () => clearTimeout(timeout); // Cleanup
}, [navigate]);

  return <p>Redirecting...</p>;
};

export default OAuth2RedirectHandler;
