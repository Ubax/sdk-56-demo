import { setResponseHeaders } from 'expo-server';

// Logs the client in by setting the auth cookie the middleware checks for.
// No Secure flag so it works over http://localhost in dev; HttpOnly is fine —
// the middleware reads it server-side and the native cookie jar still re-sends it.
export function POST() {
  setResponseHeaders((headers) => {
    headers.append('Set-Cookie', 'token=1234; Path=/; HttpOnly; SameSite=Lax');
  });
  return Response.json({ ok: true });
}
