"use client";
import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";

import { MessageCircle, ThumbsUp, Send, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Item } from "../types/feeds";

export default function PostCard({ item }: { item: Item }) {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl cursor-pointer transition-all group">
      <div className="flex items-center gap-4 px-4 pt-4 relative">
        <Image
          src="/profile.png"
          alt="profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold">John Doe - @johndoe</h2>
          <p className="text-xs text-muted-foreground">
            {dayjs(item.createdAt).format("DD-MM-YYYY")}
          </p>
        </div>

        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <MoreButton />
        </div>
      </div>

      <div className="relative min-h-80 ">
        <Image
          src={item.spotifyTrack.image}
          alt={item.spotifyTrack.name}
          fill
          className="aspect-square h-full object-cover"
        />
        {/* blur overlay, glassmorphism */}
        <div className="absolute h-full w-full bg-zinc-800/50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10" />
        {/* card content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-zinc-800 rounded-xl flex flex-col gap-2 max-w-40">
          <div className="relative h-32 aspect-square">
            <Image
              src={item.spotifyTrack.image}
              alt={item.spotifyTrack.name}
              fill
              className="aspect-square object-cover rounded-md w-full"
            />
          </div>

          <div className="space-y-1">
            <p className="text-white font-bold text-lg">
              {item.spotifyTrack.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.spotifyTrack.artists}
            </p>
          </div>
        </div>
      </div>
      <div className="px-4">
        <p className="text-sm">{item.message}</p>
      </div>

      <div className="flex items-center gap-2 pb-4 px-4">
        <Button>
          <ThumbsUp />
        </Button>
        <CommentButton />
      </div>
    </div>
  );
}

function CommentButton() {
  const [isOpen, onOpenChange] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <MessageCircle />
      </Button>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="font-[family-name:var(--font-plus-jakarta-sans)]">
          <DialogHeader>
            <DialogTitle className="text-sm">User1 - Kontent</DialogTitle>
            <DialogDescription className="text-xs">
              20-01-2023
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col max-h-60 overflow-y-scroll relative">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-4 pt-4">
                <Image
                  src="/images/profile.png"
                  alt="profile"
                  width={50}
                  height={50}
                  className="rounded-full bg-zinc-500"
                />
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm font-semibold">John Doe</h2>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, quia.
                  </p>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-2 pb-4 px-4 sticky bottom-0 bg-white p-3">
              <input
                type="text"
                className="w-full text-sm p-2"
                placeholder="Tulis komentar..."
              />
              <Button size="icon">
                <Send />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MoreButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Bagikan</DropdownMenuItem>
        <DropdownMenuItem>Report</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
