import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-text-primary mb-4">404</h2>
        <p className="text-text-muted mb-6">Page not found</p>
        <Link href="/moestate-news">
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
