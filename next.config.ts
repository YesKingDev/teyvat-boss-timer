import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "genshin.jmp.blue",
        pathname: "/boss/**",
      },
    ],
    // Local fallback artwork is generated SVG served from /public.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
