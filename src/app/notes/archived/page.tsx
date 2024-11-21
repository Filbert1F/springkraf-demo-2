"use client"

import { useSearchParams } from "next/navigation";
import GetNotes from "@/app/modules/get-notes";

export default function Notes() {
  const searchParams = useSearchParams();
  const searchTitleParam = searchParams.get('title')
  
  return (
    <GetNotes
      endpoint="notes/archived"
      searchTitleParam={searchTitleParam}
      isArchive={true}
    />
  );
}
