import withPWA from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
                port: "",
            },
        ],
    },
};

export default withPWA({
    dest: "public",
    register: true,
    workboxOptions: {
        disableDevLogs: true,
    },
})(nextConfig);
