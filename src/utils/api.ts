export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  // Add cache buster to avoid stale results
  const urlObj = new URL(url, window.location.origin);
  urlObj.searchParams.set('_v', Date.now().toString());
  const finalUrl = urlObj.toString();

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Add a timeout to the fetch request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 75000); // 75 seconds timeout 

  try {
    console.log(`fetchWithAuth: Fetching ${finalUrl}`, { method: options.method || 'GET' });
    const response = await fetch(finalUrl, { 
      ...options, 
      headers,
      signal: controller.signal
    });
    console.log(`fetchWithAuth: Received response from ${url}`, { status: response.status });
    clearTimeout(timeoutId);

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
      throw new Error('Session expired. Please login again.');
    }

    // Check for JSON content-type
    const contentType = response.headers.get('content-type');
    if (!response.ok && (!contentType || !contentType.includes('application/json'))) {
      const text = await response.text();
      console.error('Non-JSON error response:', text);
      throw new Error(`Server returned an error (${response.status}): ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw error;
  }
};
