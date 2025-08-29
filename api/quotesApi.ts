// api/quotes.js

export default async function handler(request, response) {
  // Set CORS headers for all responses
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle the pre-flight OPTIONS request
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // --- The rest of your logic is the same ---
  try {
    const apiURL = 'https://zenquotes.io/api/quotes';
    const fetchResponse = await fetch(apiURL);
    if (!fetchResponse.ok) {
      return response.status(fetchResponse.status).json({ message: 'Error from ZenQuotes API' });
    }
    const quotesData = await fetchResponse.json();
    return response.status(200).json(quotesData);
  } catch (error) {
    console.error('Proxy Error:', error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}