import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import "./unauthorized.css"

export default function UnauthorizedPage() {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-icon">
          <ShieldAlert className="shield-icon" />
        </div>
        <h1 className="unauthorized-title">Access Denied</h1>
        <p className="unauthorized-message">
          You don't have permission to access this page. Please log in with an account that has the required
          permissions.
        </p>
        <div className="unauthorized-actions">
          <Link href="/">
            <Button variant="outline">Go to Homepage</Button>
          </Link>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
