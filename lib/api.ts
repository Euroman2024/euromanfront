// Utilidades para consumir los endpoints del backend Node.js
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:3010/api";

// Helper para requests genéricos
async function apiRequest(path: string, options: { method?: string; body?: any; } = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  let body = options.body;
  
  // Si el body es un objeto, convertirlo a JSON
  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams)) {
    body = JSON.stringify(body);
  }
  
  const res = await fetch(`${BASE_URL}/${path}`, {
    headers,
    ...options,
    body,
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP ${res.status}`);
  }
  
  return res.json();
}

// CRUD Clientes
export const apiClientes = {
  list: async () => {
    const res = await apiRequest('clientes');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`clientes/${id}`),
  create: (data: any) => apiRequest('clientes', { method: 'POST', body: data }),
  update: (id: number|string, data: any) => apiRequest(`clientes/${id}`, { method: 'PUT', body: data }),
  delete: (id: number|string) => apiRequest(`clientes/${id}`, { method: 'DELETE' }),
};

// CRUD Entidades
export const apiEntidades = {
  list: async () => {
    const res = await apiRequest('entidades');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`entidades/${id}`),
  create: (data: any) => apiRequest('entidades', { method: 'POST', body: data }),
  update: (id: number|string, data: any) => apiRequest(`entidades/${id}`, { method: 'PUT', body: data }),
  delete: (id: number|string) => apiRequest(`entidades/${id}`, { method: 'DELETE' }),
};

// CRUD Vehículos
export const apiVehiculos = {
  list: async () => {
    const res = await apiRequest('vehiculos');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`vehiculos/${id}`),
  create: (data: any) => apiRequest('vehiculos', { method: 'POST', body: data }),
  update: (id: number|string, data: any) => apiRequest(`vehiculos/${id}`, { method: 'PUT', body: data }),
  delete: (id: number|string) => apiRequest(`vehiculos/${id}`, { method: 'DELETE' }),
};

// CRUD Proformas
export const apiProformas = {
  list: async () => {
    const res = await apiRequest('proformas');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`proformas/${id}`),
  create: (data: any) => apiRequest('proformas', { method: 'POST', body: data }),
  update: (id: number|string, data: any) => apiRequest(`proformas/${id}`, { method: 'PUT', body: data }),
  delete: (id: number|string) => apiRequest(`proformas/${id}`, { method: 'DELETE' }),
};

// CRUD Proforma Items
export const apiProformaItems = {
  list: async (proforma_id?: number|string) => {
    const res = await apiRequest(proforma_id ? `proforma-items?proforma_id=${proforma_id}` : 'proforma-items');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`proforma-items/${id}`),
  create: (data: any) => apiRequest('proforma-items', { method: 'POST', body: data }),
  update: (id: number|string, data: any) => apiRequest(`proforma-items/${id}`, { method: 'PUT', body: data }),
  delete: (id: number|string) => apiRequest(`proforma-items/${id}`, { method: 'DELETE' }),
};

// CRUD Repuestos
export const apiRepuestos = {
  list: async () => {
    const res = await apiRequest('repuestos');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`repuestos/${id}`),
  create: (data: any) => apiRequest('repuestos', { method: 'POST', body: data }),
  update: (id: number|string, data: any) => apiRequest(`repuestos/${id}`, { method: 'PUT', body: data }),
  delete: (id: number|string) => apiRequest(`repuestos/${id}`, { method: 'DELETE' }),
};
