import { AuthProvider } from '@/lib/auth-context';

export const metadata = {
  title: 'RENTX Marketplace | Service Marketplace',
  description: 'Browse and book services from verified providers, powered by RENTX token on Solana.',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
