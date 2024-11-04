// app/leaderboard/page.js
'use client';

import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the data from the Next.js API route
    fetch('/api/leaderboard')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Leaderboard</h1>
      {/* Render leaderboard data here */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
