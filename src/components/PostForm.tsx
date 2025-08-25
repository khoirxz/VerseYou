"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { TrackProps } from "@/types/track";
import { useTrackSearch } from "@/app/hooks/useTrackSearch";
import { useCreatePost } from "@/app/hooks/useCreatePost";
import { XIcon } from "lucide-react";

export default function PostForm() {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackProps | null>(null);

  const { data, isFetching, isError } = useTrackSearch(query);
  const { mutateAsync } = useCreatePost();

  const handleSelectTrack = (track: TrackProps) => {
    setSelectedTrack(track);
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTrack) {
      await mutateAsync({
        spotifyTrackSchema: selectedTrack,
        message: "Testing Message",
        moodTags: ["happy"],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {selectedTrack ? (
        <div className="space-y-3 flex flex-col justify-center items-start relative">
          <Badge
            className="absolute -top-2 -right-2 rounded-full p-1.5 cursor-pointer"
            onClick={() => setSelectedTrack(null)}>
            <XIcon className="w-4 h-4" />
          </Badge>
          <button
            role="button"
            className="flex flex-col items-start justify-start gap-2 w-full bg-zinc-200 hover:bg-zinc-100 cursor-pointer p-2 rounded-sm overflow-hidden">
            <div className="flex items-center gap-3 ">
              <Image
                src={selectedTrack.image}
                alt={selectedTrack.name}
                width={50}
                height={50}
                className="rounded-sm aspect-square object-cover bg-zinc-700"
              />
              <div className="flex flex-col items-start flex-1">
                <h2 className="text-sm font-semibold text-left">
                  {selectedTrack.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {selectedTrack.artists.join(", ")}
                </p>
              </div>
            </div>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full bg-gray-100 focus:bg-gray-200 rounded-md p-3 text-sm outline-gray-100 focus:outline-gray-200 transition-all text-left text-zinc-500">
          Tulis kenangan pada lagumu disini...
        </button>
      )}

      {selectedTrack && (
        <>
          <textarea
            placeholder="Tulis pesanmu disini..."
            className="w-full h-full bg-gray-100 focus:bg-gray-200 rounded-md p-3 text-sm outline-gray-100 focus:outline-gray-200 transition-all"
            rows={4}></textarea>

          <Button type="submit" className="">
            Kirim
          </Button>
        </>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="font-[family-name:var(--font-plus-jakarta-sans)] border-4 border-gray-300 rounded-xl">
          <DialogHeader>
            <DialogTitle>Cari lagu dibawah ini</DialogTitle>
            <DialogDescription className="text-sm">
              Apa yang kamu rasakan ?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari lagu disini..."
              className="w-full border-none focus:border-none outline-none bg-gray-100 focus:bg-gray-200 rounded-md p-3 text-sm outline-gray-100 focus:outline-gray-200 transition-all"
            />
            <div className="mt-6 space-y-2 max-h-60 text-center overflow-y-auto scroll-smooth relative">
              {isError && (
                <p className="text-sm text-red-600">Terjadi kesalahan</p>
              )}
              {query.length >= 2 && (
                <div className="space-y-3 flex flex-col justify-center items-start">
                  {data?.pages[0].items.map((track: TrackProps) => (
                    <button
                      role="button"
                      type="button"
                      onClick={() => handleSelectTrack(track)}
                      key={track.id}
                      className="flex flex-col items-start justify-start gap-2 w-full hover:bg-zinc-100 cursor-pointer p-2 rounded-sm overflow-hidden">
                      <div className="flex items-center gap-3 ">
                        <Image
                          src={track.image}
                          alt={track.name}
                          width={50}
                          height={50}
                          className="rounded-full aspect-square object-cover bg-zinc-700"
                        />
                        <div className="flex flex-col items-start flex-1">
                          <h2 className="text-sm font-semibold text-left">
                            {track.name}
                          </h2>
                          <p className="text-xs text-muted-foreground">
                            {track.artists.join(", ")}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {isFetching && (
                <div className="text-sm absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-zinc-100 opacity-50 flex items-center justify-center">
                  <p>Loading</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
