import Link from "next/link";
import { NoteType } from "../types/note";

export default function Note({ note }: { note: NoteType }) {
  return (
    <div key={note.id} className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{note.title}</h2>
        <p>{note.body}</p>
        <p>{note.id}</p>
        <div className="card-actions justify-end">
          <Link href={`/notes/${note.id}`} className="btn btn-neutral">Detail</Link>
        </div>
      </div>
    </div>
  );
}
