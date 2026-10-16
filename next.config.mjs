/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Unoptimized serving loads local public images directly with 0ms delay!
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
