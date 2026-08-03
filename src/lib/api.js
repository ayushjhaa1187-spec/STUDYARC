// src/lib/api.js
// Centralized API client that attaches Supabase JWT token to requests.

import { supabase } from './supabase';

/**
 * Retrieves the current Supabase access token, if available.
 */
async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Failed to get Supabase session:', error);
    return null;
  }
  return data?.session?.access_token || null;
}

/**
 * Wrapper around fetch that includes JSON handling and auth header.
 * @param {string} endpoint - API endpoint path, e.g. '/api/me'.
 * @param {object} options - Fetch options (method, headers, body, ...).
 */
export async function apiFetch(endpoint, options = {}) {
  const token = await getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(endpoint, {
    ...options,
    headers,
  });
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  if (!response.ok) {
    const err = new Error(`API error ${response.status}: ${response.statusText}`);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** Helper functions for common endpoints */
export const getProfile = () => apiFetch('/api/me');
export const evaluateDiagnostic = (payload) =>
  apiFetch('/api/diagnostic/evaluate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
export const getActiveSprints = () => apiFetch('/api/sprints/active');
export const getMentors = () => apiFetch('/api/mentors');
export const createBooking = (payload) =>
  apiFetch('/api/mentors/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
