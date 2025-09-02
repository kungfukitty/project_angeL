import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available.  Because this file is imported
// both on the client and during server-side rendering, guard against
// referencing `localStorage` when it is undefined.  Only attempt to
// retrieve a token in a browser environment.
api.interceptors.request.use((config) => {
  // `window` is only defined in the browser.  During SSR `window` and
  // `localStorage` are undefined which would otherwise cause a ReferenceError.
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // Attach the bearer token if one is present.  Axios will merge these
      // header values with any defaults defined at instantiation time.
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function fetchPodcasts(platform?: string) {
  const params = platform ? { platform } : {};
  const response = await api.get('/podcast', { params });
  return response.data;
}

export async function joinWaitlist(email: string, source: string = 'general') {
  const response = await api.post('/waitlist', { email, source });
  return response.data;
}

export async function getMetricsSummary() {
  const response = await api.get('/metrics/summary');
  return response.data;
}

export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
  const response = await api.post('/payments/create-checkout-session', {
    priceId,
    successUrl,
    cancelUrl,
  });
  return response.data;
}

export async function getCommunityStats() {
  const response = await api.get('/community/stats');
  return response.data;
}

export async function getDiscordInvite() {
  const response = await api.get('/community/discord/invite');
  return response.data;
}
