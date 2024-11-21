import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <Link href='/' className="btn btn-ghost text-xl">Home</Link>
      </div>
      <div className="navbar-end gap-2">
        <Link href='/register' className="btn">Register</Link>
        <Link href='/login' className="btn btn-primary">Login</Link>
      </div>
    </div>
  );
}
