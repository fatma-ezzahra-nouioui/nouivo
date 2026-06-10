// Stub API — swap function bodies for axios calls when the backend is ready.
// import axios from 'axios';
// const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

import { mockTemplates } from '../data/mockTemplates';

export async function getTemplates(category = null) {
  // TODO: return (await axios.get(`${BASE}/templates`, { params: { category } })).data;
  await new Promise(r => setTimeout(r, 150));
  return category
    ? mockTemplates.filter(t => t.category === category)
    : mockTemplates;
}

export async function getTemplate(id) {
  // TODO: return (await axios.get(`${BASE}/templates/${id}`)).data;
  await new Promise(r => setTimeout(r, 150));
  return mockTemplates.find(t => t.id === Number(id)) ?? null;
}
