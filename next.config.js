import createMDX from '@next/mdx';

/** Primary production host (redirect target for work subdomain). */
const SITE_HOST = process.env.PORTFOLIO_SITE_HOST ?? 'www.krisaziabor.com';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async redirects() {
    const token = process.env.RECRUITER_ACCESS_TOKEN;
    if (!token) return [];

    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'work.krisaziabor.com',
          },
        ],
        destination: `https://${SITE_HOST}/access/${token}`,
        permanent: false,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
