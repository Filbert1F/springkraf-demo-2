"use client"

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../auth/api";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

export default function Register() {
  const router = useRouter()

  const registerMutation = useMutation({
    mutationFn: (form: FormData) => api().post('/register', form),
    onSuccess: (data) => {
      router.replace('/notes')
      toast.success(data.data.message)
    },
    // @ts-expect-error error.response.data.message
    onError: (error) => toast.error(error.response.data.message),
  })

  const onSubmit = async (e:any) => {
    const formData = new FormData(e.currentTarget);
    e.preventDefault();
    if (formData.get('name') === '') {
      return toast.error('Name is empty')
    }
    if (formData.get('email') === '') {
      return toast.error('Email is empty')
    }
    if (formData.get('password') === '') {
      return toast.error('Password is empty')
    }

    registerMutation.mutate(formData);
  }

  return (
    <>
      <Navbar />
      <form className="flex flex-col w-full gap-2 max-w-3xl p-6" onSubmit={onSubmit}>
        <input type="text" name="name" placeholder="Name" className="input input-bordered" />
        <input type="email" name="email" placeholder="Email" className="input input-bordered" />
        <input type="password" name="password" placeholder="Password" className="input input-bordered" />
        {
          registerMutation.isPending ?
          <button className="btn btn-primary mt-2" disabled>
            <span className="loading loading-spinner"></span>
            Register
          </button> :
          <button className="btn btn-primary mt-2">Register</button>
        }
      </form>
    </>
  );
}
