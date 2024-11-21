import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import NavbarLoggedIn from "../components/navbar-logged-in"

export default async function ProtectedLayout({ children } : { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/login')
  }

  return <>
    <NavbarLoggedIn />
    <div className="p-6">
      {children}
    </div>
  </>
}