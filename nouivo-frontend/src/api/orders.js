// Stub API — swap function bodies for axios calls when the backend is ready.
// import axios from 'axios';
// const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

export async function createOrder(payload) {
  // TODO: return (await axios.post(`${BASE}/orders`, payload)).data;
  // payload: { template_id, buyer_name, buyer_email, buyer_phone, custom_text: {} }
  await new Promise(r => setTimeout(r, 1000));
  return { order_id: Math.floor(Math.random() * 90000) + 10000 };
}

export async function initiatePayment(orderId) {
  // TODO: return (await axios.post(`${BASE}/orders/${orderId}/pay`)).data;
  // Expected response: { payment_url: 'https://konnect.pay/...' }
  await new Promise(r => setTimeout(r, 800));
  return { payment_url: `/payment/success?order=${orderId}&slug=demo-${orderId}` };
}
