import ProfessionalSidebar from './ProfessionalSidebar'
import Header from './Header'

interface ProfessionalLayoutProps {
  children: React.ReactNode
}

export default function ProfessionalLayout({ children }: ProfessionalLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
      <ProfessionalSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
