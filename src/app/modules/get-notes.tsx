import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "../auth/api"
import { NoteType } from "../types/note"
import LoadingSpinner from "../components/loading-spinner"
import ErrorPage from "../components/error-page"
import Note from "../components/note"
import Link from "next/link"
import toast from "react-hot-toast"
import DialogButton from "../components/dialog-button"
import { useRouter } from "next/navigation"

export default function GetNotes({
  endpoint,
  searchTitleParam,
  isArchive
}: {
  endpoint: string
  searchTitleParam: string | null
  isArchive: boolean
}) {
  const router = useRouter()

  const notes = useQuery({
    queryKey: [endpoint, searchTitleParam],
    queryFn: async () => {
      const response = await api().get(endpoint)
      if (searchTitleParam !== null) {
        return response.data.data.filter(((el: NoteType) => el.title.includes(searchTitleParam)))
      }
      return response.data.data as NoteType[]
    }
  })

  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: (form: FormData) => api().post('/notes', form),
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.setQueryData(['notes', null], (oldData: NoteType[]) => [...oldData, data.data.data])
      document.getElementById('close-button-add-notes-archived')!.click()
    },
    // @ts-expect-error error.response.data.message
    onError: (error) => toast.error(error.response.data.message),
  })

  const onSubmitAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    e.preventDefault();
    if (formData.get('title') === '') {
      return toast.error('Title is empty')
    }
    if (formData.get('body') === '') {
      return toast.error('Body is empty')
    }

    addMutation.mutate(formData);
  }

  const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    e.preventDefault();
    if (formData.get('search_title') === '') {
      return router.replace(`/${endpoint}`)
    }
    return router.replace(`/${endpoint}?title=${formData.get('search_title')}`)
  }
  
  if (notes.isPending) return <LoadingSpinner />
  if (notes.isError) return <ErrorPage message={notes.error} />
  
  return (
    <>
      <div role="tablist" className="tabs tabs-lifted tabs-lg mb-4">
        <Link 
          href='/notes' 
          role="tab" 
          className={`tab ${!isArchive ? 'tab-active' : null}`}
        >
            Unarchived
        </Link>
        <Link 
          href='/notes/archived' 
          role="tab" 
          className={`tab ${isArchive ? 'tab-active' : null}`}
        >
          Archived
        </Link>
      </div>
      <div className="flex gap-8 w-full mb-4">
        <form className="flex gap-2 w-full" onSubmit={onSearch}>
          <input 
            type="text" 
            name="search_title" 
            placeholder="Search title" 
            className="input input-bordered w-full" 
            defaultValue={searchTitleParam ?? ''}
          />
          <button className="btn">Search</button>
        </form>

        <DialogButton
          dialogId='my_modal_4'
          title='Add Note'
          closeButtonId='close-button-add-notes-archived'
        >
          <form className="py-4 flex flex-col gap-2" onSubmit={onSubmitAdd}>
            <input type="text" name="title" placeholder="Title" className="input input-bordered" />
            <textarea name="body" placeholder="Body" className="textarea textarea-bordered"></textarea>
              {addMutation.isPending ?
                <button className="btn btn-primary btn-disabled" type="submit">
                  <span className="loading loading-spinner"></span>
                  Add
                </button> :
                <button className="btn btn-primary" type="submit">Add</button>
              }
          </form>
        </DialogButton>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:grid-cols-2">
        {notes.data.map((note:NoteType) => 
          <Note
            key={note.id} 
            note={note}
          />
        )}
      </div>
    </>
  );
}