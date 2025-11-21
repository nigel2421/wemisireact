
import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  error: string | null;
  isLoading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, error, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  const inputClass = "w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 transition-shadow disabled:bg-stone-100";
  const labelClass = "block text-sm font-medium text-stone-700 mb-1";

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-stone-800 mb-2 text-center">
          Admin Login
      </h2>
      <p className="text-center text-stone-500 mb-6 text-sm">
          Access the store management panel
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
            <div className="p-3 text-center bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r" role="alert">
                <p className="font-medium">{error}</p>
            </div>
        )}
        <fieldset disabled={isLoading} className="space-y-5">
          <div>
            <label htmlFor="username" className={labelClass}>Username</label>
            <input 
              type="text" 
              id="username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className={inputClass}
              placeholder="e.g., admin"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <input 
              type="password"
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />
          </div>
        </fieldset>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-stone-800 text-white py-3 px-4 rounded-md font-semibold hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-600 flex justify-center items-center disabled:bg-stone-500 disabled:cursor-wait"
        >
          {isLoading ? <SpinnerIcon /> : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
