import type { MiddlewareFunction, MiddlewareSettings } from 'expo-server';

// Only guard the data endpoint — `/api/login` stays reachable while logged out.
export const unstable_settings: MiddlewareSettings = {
  matcher: { patterns: ['/api/data'] },
};

const middleware: MiddlewareFunction = (request) => {
  const cookie = request.headers.get('cookie') ?? '';
  const authed = cookie.split(';').some((c) => c.trim() === 'token=1234');
  if (!authed) {
    return Response.json({ error: 'Unauthorized — log in first' }, { status: 401 });
  }
  // Returning nothing lets the request continue to the matched API route.
};

export default middleware;
