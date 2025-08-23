
import React, { useState } from 'react';
import { authService } from '../services/AuthService';
import { Leaf } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: { name: string; email: string }) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const user = isLogin 
                ? await authService.login(email, password) 
                : await authService.signUp(email, password);
            onLogin(user);
        } catch (err) {
            setError('Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EFE6] p-4">
             <div className="text-center mb-10">
                <Leaf className="w-16 h-16 mx-auto text-[#4DB6AC]"/>
                <h1 className="text-5xl font-bold text-[#2F4F4F] mt-2">StayAfloat</h1>
                <p className="text-slate-600 mt-2">Your calm, mindful companion.</p>
            </div>
            <div className="w-full max-w-sm bg-[#FAF9F6] p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-[#2F4F4F] mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-slate-600 mb-1" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DB6AC]"/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-600 mb-1" htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DB6AC]"/>
                    </div>
                    {error && <p className="text-[#FFA07A] text-center mb-4">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-[#4DB6AC] text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-300 disabled:bg-gray-400">
                        {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>
                <p className="text-center text-sm text-slate-600 mt-6">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-[#4DB6AC] hover:underline ml-1">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthScreen;
