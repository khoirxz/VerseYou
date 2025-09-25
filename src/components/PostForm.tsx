"use client";

import { useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { XIcon, Sparkle, Loader } from "lucide-react";

import { useTrackSearch } from "@/hooks/useTrackSearch";
import { useCreatePost } from "@/hooks/useCreatePost";
import { createPostSchema, SpotifyTrackProps } from "@/lib/validation";

export default function PostForm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-xl p-3 text-sm text-zinc-500 hover:bg-zinc-100/80 transition-all">
        Tulis kenangan pada lagumu disini...
      </div>

      <ModalForm open={isOpen} setOpen={setIsOpen} />
    </div>
  );
}

function ModalForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
  });

  const { mutateAsync, isPending } = useCreatePost();

  const onSubmit = async (data: z.infer<typeof createPostSchema>) => {
    // debug
    // return console.log(data);
    await mutateAsync({
      spotifyTrackSchema: data.spotifyTrackSchema,
      message: data.message,
      moodTags: data.moodTags,
      toName: data.toName,
    });
  };

  const handleDeleteTrack = () => {
    reset({
      spotifyTrackSchema: undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat kenangan baru</DialogTitle>
          <DialogDescription className="text-sm">
            Tulis kenangan pada lagumu disini
          </DialogDescription>
        </DialogHeader>

        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4">
          {watch("spotifyTrackSchema") ? (
            <div
              className="flex items-center gap-4 bg-zinc-100 rounded-xl p-3 relative group"
              onClick={handleDeleteTrack}>
              <Badge
                variant={"destructive"}
                className="absolute -top-2 -right-2 p-1 rounded-full group-hover:scale-100 transition-all">
                <XIcon />
              </Badge>
              <Image
                src={watch("spotifyTrackSchema").image}
                alt={watch("spotifyTrackSchema").name}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-semibold">
                  {watch("spotifyTrackSchema").name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {watch("spotifyTrackSchema").artists?.join(", ")}
                </p>
              </div>
            </div>
          ) : (
            <Controller
              control={control}
              name="spotifyTrackSchema"
              render={({ field }) => <SearchTrack onChange={field.onChange} />}
            />
          )}

          <input
            placeholder="Untuk siapa nih ?"
            {...register("toName")}
            className="w-full border-none focus:border-none outline-none bg-gray-100 focus:bg-gray-200 rounded-md p-3 text-sm outline-gray-100 focus:outline-gray-200 transition-all"
          />
          <input
            placeholder="Gimana feeling kamu tentang lagu ini ? :)"
            {...register("moodTags", {
              setValueAs: (v: string) => {
                if (typeof v !== "string") return [];
                return Array.from(
                  new Set(
                    v
                      .split(/[,\n]/)
                      .map((s) => s.trim().toLowerCase())
                      .filter(Boolean)
                  )
                ).slice(0, 5);
              },
            })}
            className="w-full border-none focus:border-none outline-none bg-gray-100 focus:bg-gray-200 rounded-md p-3 text-sm outline-gray-100 focus:outline-gray-200 transition-all"
          />

          <textarea
            placeholder="Pesan mu buat lagu ini"
            {...register("message")}
            className="w-full border-none focus:border-none outline-none bg-gray-100 focus:bg-gray-200 rounded-md p-3 text-sm outline-gray-100 focus:outline-gray-200 transition-all h-40"
          />

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary disabled:bg-primary/60 rounded-2xl p-3 text-white font-sans flex items-center gap-2 justify-center font-semibold">
            Posting{" "}
            {isPending ? (
              <Loader className="size-4" />
            ) : (
              <Sparkle className="size-4" />
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SearchTrack({
  onChange,
}: {
  onChange: (track: SpotifyTrackProps) => void;
}) {
  const [query, setQuery] = useState<string>("");
  const { data, isFetching, isError } = useTrackSearch(query);

  const handleSelectTrack = (track: SpotifyTrackProps) => {
    onChange(track);
    setQuery("");
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari lagu disini..."
        className="w-full border-none focus:border-none outline-none bg-gray-100 focus:bg-gray-200 rounded-md p-3 text-sm outline-gray-100 focus:outline-gray-200 transition-all"
      />

      {query.length >= 2 && (
        <div className="space-y-2 max-h-60 text-center overflow-y-auto scroll-smooth absolute top-12 w-full bg-white rounded-md p-5">
          {isError && <p className="text-sm text-red-600">Terjadi kesalahan</p>}
          {query.length >= 2 && (
            <div className="space-y-3 flex flex-col justify-center items-start">
              {data?.pages[0].items.map((track: SpotifyTrackProps) => (
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
      )}
    </div>
  );
}
