/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adicione outras configurações do Next.js aqui se precisar
  
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/, // Aplica a regra apenas para arquivos TSX/JSX
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
