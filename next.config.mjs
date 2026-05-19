/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        destination: 'https://invitation-28b16.firebaseapp.com/__/auth/:path*',
      },
    ]
  },
}

export default nextConfig
