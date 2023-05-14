require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

module.exports = {
  env: {
    REACT_APP_API_KEY: process.env.REACT_APP_API_KEY,
  },
};
