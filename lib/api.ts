// Utilidades para consumir los endpoints del backend PHP
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://192.168.100.112/proformas/euroman/";

// Helper para requests genéricos
async function apiRequest(path: string, options: { method?: string; body?: any; } = {}) {
  let headers = { 'Content-Type': 'application/json' };
  let body = options.body;
  if (body instanceof URLSearchParams) {
    headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  }
  const res = await fetch(`${BASE_URL}/${path}`, {
    headers,
    ...options,
    body,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// CRUD Clientes
export const apiClientes = {
  list: async () => {
    const res = await apiRequest('clientes');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`clientes?id=${id}`),
  create: (data: any) => apiRequest('clientes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number|string, data: any) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value as string)
    });
    return apiRequest(`clientes?id=${id}`, { method: 'PUT', body: params });
  },
  delete: (id: number|string) => apiRequest(`clientes?id=${id}`, { method: 'DELETE' }),
};

// CRUD Entidades
export const apiEntidades = {
  list: async () => {
    const res = await apiRequest('entidades');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`entidades?id=${id}`),
  create: (data: any) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value as string)
    });
    return apiRequest('entidades', { method: 'POST', body: params });
  },
  update: (id: number|string, data: any) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value as string)
    });
    return apiRequest(`entidades?id=${id}`, { method: 'PUT', body: params });
  },
  delete: (id: number|string) => apiRequest(`entidades?id=${id}`, { method: 'DELETE' }),
};

// CRUD Vehículos
export const apiVehiculos = {
  list: async () => {
    const res = await apiRequest('vehiculos');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`vehiculos?id=${id}`),
  create: (data: any) => apiRequest('vehiculos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number|string, data: any) => apiRequest(`vehiculos?id=${id}`, { method: 'PUT', body: data }),
  delete: (id: number|string) => apiRequest(`vehiculos?id=${id}`, { method: 'DELETE' }),
};

// CRUD Proformas
export const apiProformas = {
  list: async () => {
    const res = await apiRequest('proformas');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`proformas?id=${id}`),
  create: (data: any) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value as string)
    });
    return apiRequest('proformas', { method: 'POST', body: params });
  },
  update: (id: number|string, data: any) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value as string)
    });
    return apiRequest(`proformas?id=${id}`, { method: 'PUT', body: params });
  },
  delete: (id: number|string) => apiRequest(`proformas?id=${id}`, { method: 'DELETE' }),
};

// CRUD Proforma Items
export const apiProformaItems = {
  list: async (proforma_id?: number|string) => {
    const res = await apiRequest(proforma_id ? `proforma-items?proforma_id=${proforma_id}` : 'proforma-items');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`proforma-items?id=${id}`),
  create: (data: any) => apiRequest('proforma-items', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number|string, data: any) => apiRequest(`proforma-items?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number|string) => apiRequest(`proforma-items?id=${id}`, { method: 'DELETE' }),
};

// CRUD Repuestos
export const apiRepuestos = {
  list: async () => {
    const res = await apiRequest('repuestos');
    return res.data || [];
  },
  get: (id: number|string) => apiRequest(`repuestos?id=${id}`),
  create: (data: any) => apiRequest('repuestos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number|string, data: any) => apiRequest(`repuestos?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number|string) => apiRequest(`repuestos?id=${id}`, { method: 'DELETE' }),
};
