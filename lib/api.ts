// Utilidades para consumir los endpoints del backend PHP
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://192.168.100.112/proformas/euroman/";

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
  list: () => apiRequest('repuestos/api_clientes.php'),
  get: (id: number|string) => apiRequest(`repuestos/api_clientes.php?id=${id}`),
  create: (data: any) => apiRequest('repuestos/api_clientes.php', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number|string, data: any) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value as string)
    });
    return apiRequest(`repuestos/api_clientes.php?id=${id}`, { method: 'PUT', body: params });
  },
  delete: (id: number|string) => apiRequest(`repuestos/api_clientes.php?id=${id}`, { method: 'DELETE' }),
};

// CRUD Entidades
export const apiEntidades = {
  list: () => apiRequest('repuestos/api_entidades.php'),
  get: (id: number|string) => apiRequest(`repuestos/api_entidades.php?id=${id}`),
  create: (data: any) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value as string)
    });
    return apiRequest('repuestos/api_entidades.php', { method: 'POST', body: params });
  },
  update: (id: number|string, data: any) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value as string)
    });
    return apiRequest(`repuestos/api_entidades.php?id=${id}`, { method: 'PUT', body: params });
  },
  delete: (id: number|string) => apiRequest(`repuestos/api_entidades.php?id=${id}`, { method: 'DELETE' }),
};

// CRUD Vehículos
export const apiVehiculos = {
  list: () => apiRequest('repuestos/api_vehiculos.php'),
  get: (id: number|string) => apiRequest(`repuestos/api_vehiculos.php?id=${id}`),
  create: (data: any) => apiRequest('repuestos/api_vehiculos.php', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number|string, data: any) => apiRequest(`repuestos/api_vehiculos.php?id=${id}`, { method: 'PUT', body: data }),
  delete: (id: number|string) => apiRequest(`repuestos/api_vehiculos.php?id=${id}`, { method: 'DELETE' }),
};

// CRUD Proformas
export const apiProformas = {
  list: () => apiRequest('repuestos/api_proformas.php'),
  get: (id: number|string) => apiRequest(`repuestos/api_proformas.php?id=${id}`),
  create: (data: any) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value as string)
    });
    return apiRequest('repuestos/api_proformas.php', { method: 'POST', body: params });
  },
  update: (id: number|string, data: any) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value as string)
    });
    return apiRequest(`repuestos/api_proformas.php?id=${id}`, { method: 'PUT', body: params });
  },
  delete: (id: number|string) => apiRequest(`repuestos/api_proformas.php?id=${id}`, { method: 'DELETE' }),
};

// CRUD Proforma Items
export const apiProformaItems = {
  list: (proforma_id?: number|string) => proforma_id
    ? apiRequest(`repuestos/api_proforma_items.php?proforma_id=${proforma_id}`)
    : apiRequest('repuestos/api_proforma_items.php'),
  get: (id: number|string) => apiRequest(`repuestos/api_proforma_items.php?id=${id}`),
  create: (data: any) => apiRequest('repuestos/api_proforma_items.php', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number|string, data: any) => apiRequest(`repuestos/api_proforma_items.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number|string) => apiRequest(`repuestos/api_proforma_items.php?id=${id}`, { method: 'DELETE' }),
};

// CRUD Repuestos
export const apiRepuestos = {
  list: () => apiRequest('repuestos/api_repuestos.php'),
  get: (id: number|string) => apiRequest(`repuestos/api_repuestos.php?id=${id}`),
  create: (data: any) => apiRequest('repuestos/api_repuestos.php', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number|string, data: any) => apiRequest(`repuestos/api_repuestos.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number|string) => apiRequest(`repuestos/api_repuestos.php?id=${id}`, { method: 'DELETE' }),
};
