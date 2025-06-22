import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const resp = await fetch(
      `/signup?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      { method: 'POST' }
    );
    if (resp.status === 201) {
      navigate('/login');
    } else {
      let detail = "Signup failed";
      try {
        const data = await resp.json();
        detail = data.detail || detail;
      } catch { /* fallback */ }
      alert(detail);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="w-full max-w-md px-7 py-10 bg-neutral-900/90 border border-neutral-800 shadow-xl rounded-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-neutral-100 mb-1 tracking-tight">Create account</h1>
        <p className="mb-8 text-neutral-400 text-xs">
          for <span className="font-mono text-blue-500 tracking-tight">IssueTracker</span>
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-xs text-neutral-400 font-semibold mb-1 pl-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-neutral-100 placeholder:text-neutral-500 transition text-sm"
              required
              autoFocus
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 font-semibold mb-1 pl-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Set a password"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-neutral-100 placeholder:text-neutral-500 transition text-sm"
              required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 active:scale-95 transition text-base shadow"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-8 text-center text-neutral-500 text-xs">
          Already registered?{' '}
          <Link className="text-blue-400 font-semibold hover:underline" to="/login">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
