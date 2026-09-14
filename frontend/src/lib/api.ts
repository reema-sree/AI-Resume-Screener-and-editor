const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `API request failed with status ${res.status}`);
  }
  return res.json();
}

export async function uploadResumeFile(formData: FormData) {
  const url = `${API_BASE}/resumes/upload`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }
  return res.json();
}

export function getResumeDownloadUrl(resumeId: string) {
  return `${API_BASE}/resumes/${resumeId}/download`;
}
