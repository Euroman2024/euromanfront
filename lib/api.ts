
// Utilidades para consumir los endpoints del backend PHP
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "https://untallied-jacki-wonderless.ngrok-free.dev/proformas/euroman";
console.log('Environment NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
console.log('Final BASE_URL:', BASE_URL);

// Helper para requests genéricos
async function apiRequest(path: string, options: { method?: string; body?: any; } = {}) {
  let headers: Record<string, string> = { 
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'any'
  };
  let body = options.body;
  if (body instanceof URLSearchParams) {
    headers = { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'ngrok-skip-browser-warning': 'any'
    };
  }
  
  const fullUrl = `${BASE_URL}/${path}`;
  console.log('API Request URL:', fullUrl); // Debug log
  console.log('BASE_URL:', BASE_URL); // Debug log
  console.log('Path received:', path); // Debug log
  
  const res = await fetch(fullUrl, {

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
