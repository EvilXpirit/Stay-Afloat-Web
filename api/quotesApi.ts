// api/quotes.js

export default async function handler(request, response) {
  try {
    const apiURL = 'https://zenquotes.io/api/quotes';
    const fetchResponse = await fetch(apiURL);

    if (!fetchResponse.ok) {
      return response.status(fetchResponse.status).json({ message: 'Error from ZenQuotes API' });
    }

    const quotesData = await fetchResponse.json();

    // ===================================================================
    // THIS IS THE FIX. WE ARE ADDING PERMISSION HEADERS TO OUR OWN API.
    // ===================================================================
    // Allow requests from any origin (*). This is safe for a public quotes API.
    response.setHeader('Access-Control-Allow-Origin', '*');
    // Specify which methods are allowed.
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    // Specify which headers are allowed.
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // ===================================================================

    // Send the data back to your frontend
    return response.status(200).json(quotesData);

  } catch (error) {
    console.error('Proxy Error:', error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}