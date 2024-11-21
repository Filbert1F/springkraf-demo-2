"use client"

import { useSearchParams } from "next/navigation";
import GetNotes from "../modules/get-notes";

export default function Notes() {
  const searchParams = useSearchParams();
  const searchTitleParam = searchParams.get('title')
  
  return (
    <GetNotes
      endpoint="notes"
      searchTitleParam={searchTitleParam}
      isArchive={false}
    />
  );
}