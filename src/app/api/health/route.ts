export const runtime = "nodejs";
export async function GET() {
  // debug
  const testEnv = process.env.MONGODB_USER;
  return Response.json({
    ok: true,
    ts: new Date().toISOString().substring(0, 10),
    test: testEnv,
  });
}
