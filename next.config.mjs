import bundleAnalyzer from "@next/bundle-analyzer";

/**
 * @type {import('next').NextConfig}
 */

// 🔹 bundle-analyzer 설정 추가
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  webpack(config, { isServer }) {
    // 🔸 기존 SVG 설정 유지
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: "removeViewBox", active: false }, // viewBox 유지
                { name: "removeDimensions", active: true }, // width/height 제거
              ],
            },
          },
        },
      ],
    });

    // ✅ citation-js 관련 Node 내장 모듈 fallback 추가
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};

// 🔹 bundle-analyzer 적용 후 export
export default withBundleAnalyzer(nextConfig);
