"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCookies } from "next-client-cookies";
import api from "../auth/api";
import Navbar from "../components/navbar";

export default function Home() {
  const router = useRouter()
  const cookies = useCookies();

  const loginMutation = useMutation({
    mutationFn: (form: FormData) => api().post('/login', form),
    onSuccess: async (data) => {
      cookies.set('token', data.data.data.accessToken)
      toast.success(data.data.message)
      router.replace('/notes')
    },
    // @ts-expect-error error.response.data.message
    onError: (error) => toast.error(error.response.data.message),
  })

  const onSubmit = (e:React.FormEvent<HTMLFormElement>
  ) => {
    const formData = new FormData(e.currentTarget);
    e.preventDefault();
    if (formData.get('email') === '') {
      return toast.error('Email is empty')
    }
    if (formData.get('password') === '') {
      return toast.error('Password is empty')
    }
    loginMutation.mutate(formData);
  }

  return (
    <>
      <Navbar />
      <form className="flex flex-col w-full gap-2 max-w-3xl p-6" onSubmit={onSubmit}>
        <input type="email" name="email" placeholder="Email" className="input input-bordered" />
        <input type="password" name="password" placeholder="Password" className="input input-bordered" />
        {
          loginMutation.isPending ?
          <button className="btn btn-primary mt-2" disabled>
            <span className="loading loading-spinner"></span>
            Login
          </button> :
          <button className="btn btn-primary mt-2">Login</button>
        }
      </form>
    </>
  );
}
