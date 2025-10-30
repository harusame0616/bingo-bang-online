/** @type {import('next').NextConfig} */
const nextConfig = {
	cacheComponents: true,
	cacheLife: {
		permanent: {
			stale: 60 * 60 * 24 * 365, // 1年
			revalidate: 60 * 60 * 24 * 365, // 1年
			expire: 60 * 60 * 24 * 365, // 1年
		},
	},
	transpilePackages: ["@repo/prisma"],
};

module.exports = nextConfig;
