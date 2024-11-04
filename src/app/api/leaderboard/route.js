// app/api/leaderboard/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'https://unstop.com/api/public/live-leaderboard/114321/assessmentnewround?page=2&per_page=30&filterName=timestamp&filterValue=1730193671&undefined=true';

  try {
    // Fetch data from the Unstop API
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch data' }, { status: response.status });
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data as JSON
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
