/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем строгую CSP, чтобы wagmi работал
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
