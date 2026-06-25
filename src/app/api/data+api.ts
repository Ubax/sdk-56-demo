// Protected endpoint — `+middleware.ts` rejects requests without the auth cookie
// before this handler runs.
export function GET() {
  return Response.json({ value: Math.floor(Math.random() * 1000) });
}
