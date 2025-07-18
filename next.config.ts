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
        swSrc: "public/custom-sw.js", // if your file is at public/custom-sw.js
    },
})(nextConfig);