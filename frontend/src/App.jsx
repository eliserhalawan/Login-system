import { useEffect } from 'react';
import {useState} from 'react';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem('token');
  
  if (token) {
    fetch('http://localhost:3000/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        // Token expired or invalid
        localStorage.removeItem('token');
      }
    })
    .then(data => {
      if (data && data.user) {
        setUsername(data.user.username);
        setIsLoggedIn(true);
      }
    });
  }
}, []);

  const handleSubmit = async () => {
    setMessage('');

    const endpoint = isLogin ? '/api/login' : '/api/signup';

    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
     if (isLogin) {
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
    } else {
      setMessage('Account created! You can now login.');
      setIsLogin(true);
      setPassword('');
    }
  } else {
    setMessage(data.error || data.message);
  }
};

    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
      setMessage('');
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
          <p className="text-gray-600 mb-6">You are logged in as <span className="font-semibold text-purple-600">{username}</span></p>
          <button 
            onClick={handleLogout}
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600">
               Logout
            </button>

      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md"> 
       <h1 className="text-3xl font-bold text-center mb-6">
        {isLogin ? 'Login' : 'Sign Up'}
       </h1>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Username"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600">
          {isLogin ? 'Login' : 'Sign Up'}
          </button>

        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
           message.includes('successful') || message.includes('created')
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <button  
            onClick={() =>setIsLogin(!isLogin)}
            className="text-purple-600 hover:text-purple-700">
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>
        </div>
      </div>
    </div>
  );
}



      


