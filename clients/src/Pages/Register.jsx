import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [pin, setPin] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!email || !fullname || !pin) return alert("All feilds are required!");
    
    try {
      const response = await axios.post("/register", {
        email,
        fullname,
        pin,
      });
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-blue-50">
      <h2 className="text-3xl mb-6">Register</h2>
      <form className="w-full max-w-sm" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <input
          type="password"
          placeholder="PIN"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;

