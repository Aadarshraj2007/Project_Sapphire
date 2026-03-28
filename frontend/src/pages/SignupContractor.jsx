import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const SignupContractor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cppUserId: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/contractor/signup", form);
      alert("Signup successful. Wait for admin approval.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 shadow w-96">
        <h2 className="text-xl mb-4">Contractor Signup</h2>

        <input className="input" placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input className="input" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input className="input" placeholder="Phone"
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <input className="input" placeholder="CPP User ID"
          onChange={(e) => setForm({ ...form, cppUserId: e.target.value })} />

        <input type="password" className="input" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button className="btn w-full">Signup</button>
      </form>
    </div>
  );
};

export default SignupContractor;