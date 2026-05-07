export async function apiRequest(path, options = {}) {
  const requestOptions = buildRequestOptions(options);
  const response = await fetch(path, requestOptions);
  const payload = await response.json().catch(() => ({}));

  if (response.status === 401 && !path.startsWith('/api/auth/')) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return apiRequest(path, options);
    }
  }

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Request failed. Please try again.');
  }

  return payload.data;
}

function buildRequestOptions(options) {
  if (!options.body || options.body instanceof FormData) {
    return {
      ...options,
      credentials: options.credentials ?? 'same-origin',
    };
  }

  return {
    ...options,
    credentials: options.credentials ?? 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(options.body),
  };
}

async function refreshAccessToken() {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'same-origin',
  });

  return response.ok;
}
