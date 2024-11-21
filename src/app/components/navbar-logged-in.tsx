"use client"

import Cookies from 'js-cookie';
import Link from "next/link";
import { useRouter } from "next/navigation";
import DialogButton from './dialog-button';

export default function NavbarLoggedIn() {
  const router = useRouter()

  function handleLogout() {
    Cookies.remove('token')
    router.replace('/login')
  }
  
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <Link href='/notes' className="btn btn-ghost text-xl">Home</Link>
      </div>

      <div className="navbar-end gap-2">
        <DialogButton 
          title='Logout' 
          dialogId='my_modal_2' 
          closeButtonId='close_logout'
          state='error'
        >
          <p className="py-4">Are you sure?</p>
            <div className="modal-action">
              <form method="dialog">
                <div className='flex gap-2'>
                  <button className="btn">Cancel</button>
                  <button className="btn btn-error" onClick={handleLogout}>Logout</button>
                </div>
              </form>
            </div>
        </DialogButton>
      </div>
    </div>
  );
}
