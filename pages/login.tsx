import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) router.push('/dashboard');
    else alert(data.message);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="p-2 border mb-2"/>
      <input placeholder="Password" value={password} type="password" onChange={e => setPassword(e.target.value)} className="p-2 border mb-2"/>
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2">Login</button>
    </div>
  );
}
