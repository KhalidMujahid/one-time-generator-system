import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function Login() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { email, pin });
      alert(response.data.message);
      
      navigate("/verify", { state: { email } });
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-blue-50">
      <h2 className="text-3xl mb-6">Login</h2>
      <form className="w-full max-w-sm" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="PIN"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

