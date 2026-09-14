/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: { root: import.meta.dirname },
  // STATIC_EXPORT=1 이면 정적 내보내기(out/) — Cloudflare Workers 정적 자산 배포용.
  // POST 라우트(app/api/chat)는 내보내기에서 빠지고, 같은 로직을 worker.js 가 대신 서빙한다.
  ...(process.env.STATIC_EXPORT === '1' ? { output: 'export', trailingSlash: true } : {}),
};

export default nextConfig;
