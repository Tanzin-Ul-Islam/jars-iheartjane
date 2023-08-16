/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["jars-dutchi.nyc3.digitaloceanspaces.com"],
    formats: ["image/webp"],
  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots'
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      },
      {
        source: '/blog.xml',
        destination: '/api/blog'
      },
      {
        source: '/product.xml',
        destination: '/api/product'
      }
    ];
  }
}

module.exports = nextConfig
