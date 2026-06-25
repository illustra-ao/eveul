import type { NextConfig } from "next";

function getSupabaseStorageHost() {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
        "https://ttyzeybvndxcswtzdrdo.supabase.co",
    ).hostname;
  } catch {
    return "ttyzeybvndxcswtzdrdo.supabase.co";
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: getSupabaseStorageHost(),
        pathname: "/storage/v1/**",
      },
    ],
  },
};

export default nextConfig;
