"use client"

import api from "@/app/auth/api";
import ErrorPage from "@/app/components/error-page";
import LoadingSpinner from "@/app/components/loading-spinner";
import { NoteType } from "@/app/types/note";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Notes() {
  const { id } = useParams()
  const router = useRouter()

  const note = useQuery({
    queryKey: ['notes', id],
    queryFn: async () => {
      const response = await api().get(`notes/${id}`)
      return response.data.data as NoteType
    }
  })

  const queryClient = useQueryClient()

  const archiveMutation = useMutation({
    mutationFn: () => api().post(`notes/${id}/archive`),
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.setQueryData(['notes', id], (oldData: NoteType) => {
        oldData.archived = true
      })
    },
    // @ts-expect-error error.response.data.message
    onError: (error) => toast.error(error.response.data.message),
  })

  const unarchiveMutation = useMutation({
    mutationFn: () => api().post(`notes/${id}/unarchive`),
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.setQueryData(['notes', id], (oldData: NoteType) => {
        oldData.archived = false
      })
    },
    // @ts-expect-error error.response.data.message
    onError: (error) => toast.error(error.response.data.message),
  })

  const deleteMutation = useMutation({
    mutationFn: () => api().delete(`notes/${id}`),
    onSuccess: (data) => {
      toast.success(data.data.message)
      router.replace('/notes')
    },
    // @ts-expect-error error.response.data.message
    onError: (error) => toast.error(error.response.data.message),
  })

  const onClickArchive = () => {
    archiveMutation.mutate();
  }

  const onClickUnarchive = () => {
    unarchiveMutation.mutate();
  }

  const onClickDelete = () => {
    deleteMutation.mutate();
  }
  
  if (note.isPending) return <LoadingSpinner />
  if (note.isError) return <ErrorPage message={note.error} />
  
  return (
    <>
      <div className="flex gap-2 mb-4">
        {!note.data.archived ? 
          <button className="btn" onClick={onClickArchive}>Archive</button> : 
          <button className="btn" onClick={onClickUnarchive}>Unarchive</button>
        }
        <button className="btn btn-error" onClick={onClickDelete}>Delete</button>
      </div>
      {note.data.archived ? <div className="badge badge-neutral">Archived</div> : null}
      <div className="card-body">
        <h2 className="card-title">{note.data.title}</h2>
        <p>{note.data.body}</p>
        <p>{note.data.id}</p>
        <p>{note.data.owner}</p>
        <p>{note.data.createdAt}</p>
      </div>
    </>
  );
}
