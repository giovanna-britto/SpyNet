import { createCivicAuthPlugin } from '@civic/auth-web3/nextjs'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*', // Mantém as rotas de auth no Next.js
      },
      {
        source: '/api/:path*',
        destination: 'https://spynet-5ifn.onrender.com/:path*', // Outras rotas vão para o backend externo
      },
    ]
  },
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

const withCivicAuth = createCivicAuthPlugin({
  clientId: 'bf675b40-bbe6-4efb-bb71-a76a40ccab48',
  oauthServer: process.env.AUTH_SERVER || 'https://auth.civic.com/oauth',
  // @ts-ignore - endpoints é válido em runtime
  endpoints: { wallet: process.env.NEXT_PUBLIC_WALLET_API_BASE_URL },
  loginSuccessUrl: `http://localhost:${PORT}/dashboard`,
  // logoutUrl: `http://localhost:${PORT}/`,
})

export default withCivicAuth(nextConfig)