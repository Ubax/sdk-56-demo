import { setResponseHeaders } from 'expo-server';

// Logs the client out by expiring the auth cookie. Must match login's Path/SameSite
// so the browser/native cookie jar overwrites the right cookie; Max-Age=0 deletes it.
export function POST() {
  setResponseHeaders((headers) => {
    headers.append('Set-Cookie', 'token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  });
  return Response.json({ ok: true });
}
