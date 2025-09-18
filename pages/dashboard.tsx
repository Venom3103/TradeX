import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Dashboard() {
  const { data: user, mutate } = useSWR('/api/user', fetcher);
  const router = useRouter();

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [side, setSide] = useState('buy');
  const [price, setPrice] = useState(100); // Mock price, can later replace with API

  if (!user) return <div>Loading...</div>;

  const handleTrade = async () => {
    const res = await fetch('/api/trade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, quantity, side, price }),
    });
    const data = await res.json();
    if (res.ok) mutate(); // Refresh user data
    else alert(data.message);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    router.push('/login');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="mb-4 text-lg">Balance: <span className="font-semibold">{user.balance}</span></p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Symbol</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(user.holdings).map(([sym, qty]: any) => (
              <tr key={sym}>
                <td className="px-4 py-2 border">{sym}</td>
                <td className="px-4 py-2 border">{qty}</td>
                <td className="px-4 py-2 border">{price}</td>
                <td className="px-4 py-2 border">{(qty * price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Execute Trade</h2>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="p-2 border rounded"
          />
          <select
            value={side}
            onChange={(e) => setSide(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="p-2 border rounded"
          />
          <button
            onClick={handleTrade}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
}
