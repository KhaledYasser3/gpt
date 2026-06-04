const BASE_URL = 'http://127.0.0.1:5000/api/v1';

async function fetchWithAuth(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    ...(options.headers || {}),
  };

  // Don't set Content-Type for FormData — browser sets it automatically with boundary
  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response = await fetch(url, config);

  if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
    try {
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData.access_token) {
          localStorage.setItem('access_token', refreshData.access_token);
          config.headers['Authorization'] = `Bearer ${refreshData.access_token}`;
          response = await fetch(url, config);
        }
      }
    } catch (e) {
      console.error("Refresh failed", e);
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // FastAPI 422 returns detail as an array of validation errors
    const detail = data.detail;
    let errorMessage;
    if (Array.isArray(detail)) {
      // Extract human-readable messages from each validation error
      errorMessage = detail.map(e => {
        const field = e.loc ? e.loc[e.loc.length - 1] : '';
        return field ? `${field}: ${e.msg}` : e.msg;
      }).join(' | ');
    } else {
      errorMessage = detail || data.message || `Erreur ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  auth: {
    login: (email, password) => 
      fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
  },
  admin: {
    getUsers: () => 
      fetchWithAuth('/admin/users'),
    createUser: (userData) => 
      fetchWithAuth('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    deleteUser: (userId) => 
      fetchWithAuth(`/admin/users/${userId}`, {
        method: 'DELETE'
      }),
    renewUser: (userId, endDate) => 
      fetchWithAuth(`/admin/users/${userId}/renew`, {
        method: 'PATCH',
        body: JSON.stringify({ end_date: endDate })
      }),
    addTokens: (userId, tokens) => 
      fetchWithAuth(`/admin/users/${userId}/tokens`, {
        method: 'PATCH',
        body: JSON.stringify({ tokens: parseInt(tokens) })
      }),
  },
  chat: {
    getChats: (projectId = null) => 
      fetchWithAuth(projectId ? `/chats?project_id=${projectId}` : '/chats'),
    createChat: (title, projectId = null) => 
      fetchWithAuth('/chats', {
        method: 'POST',
        body: JSON.stringify({ title, project_id: projectId })
      }),
    deleteChat: (chatId) => 
      fetchWithAuth(`/chats/${chatId}`, {
        method: 'DELETE'
      }),
    getMessages: (chatId) => 
      fetchWithAuth(`/chats/${chatId}/messages`),
    sendMessage: (chatId, content, files = []) => {
      const formData = new FormData();
      formData.append('content', content);
      if (files && files.length > 0) {
        files.forEach(f => formData.append('files', f));
      }
      return fetchWithAuth(`/chats/${chatId}/messages`, {
        method: 'POST',
        body: formData,
        isFormData: true
      });
    }
  },
  projects: {
    getProjects: () =>
      fetchWithAuth('/projects'),
    createProject: (name, description = '') =>
      fetchWithAuth('/projects', {
        method: 'POST',
        body: JSON.stringify({ name, description })
      }),
    updateProject: (projectId, name, description) =>
      fetchWithAuth(`/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({ name, description })
      }),
    deleteProject: (projectId) =>
      fetchWithAuth(`/projects/${projectId}`, {
        method: 'DELETE'
      }),
  }
};
