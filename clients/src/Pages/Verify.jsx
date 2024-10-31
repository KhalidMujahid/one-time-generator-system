import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 

function Verify() {
  const [otp, setOtp] = useState('');
  const [pin,setPin] = useState("");
  const location = useLocation(); 
  const navigate = useNavigate();

  const { email } = location.state || {}; 

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/verify", { email, otp, pin });
      alert(response.data.message);
      navigate("/home");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-blue-50">
      <h2 className="text-3xl mb-6">Verify OTP</h2>
      <form className="w-full max-w-sm" onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="OTP"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <input
          type="text"
          placeholder="PIN"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Verify
        </button>
      </form>
    </div>
  );
}

export default Verify;

