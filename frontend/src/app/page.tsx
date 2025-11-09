// Server Component

import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'
import DashboardContainer from '@/components/dashboard/DashboardContainer'


export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Static header -  rendered on server */}
      <div className="relative z-20 container mx-auto px-6 py-12 max-w-6xl">
        <AppHeader />
      </div>

      {/* Interactive dashboard - client component with all stateful logic */}
      <DashboardContainer />

      {/* Static footer - rendered on server */}
      <div className="relative z-20 container mx-auto px-6 max-w-6xl">
        <AppFooter />
      </div>
    </div>
  );
}
