import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
