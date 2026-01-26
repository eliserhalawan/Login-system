import {useState} from 'react';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Sending to backend:', username, password);

    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log('Response from backend:', data);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md"> 
       <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <input
          type="text"
          value-={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <button
          onClick={handleLogin}
          className="w-full mt-4 bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors">
          Login
          </button>

      </div>
    </div>


  )
}



      


