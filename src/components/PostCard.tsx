"use client";
import { useState } from "react";
import Image from "next/image";

import { MessageCircle, ThumbsUp, Send } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function PostCard() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 hover:bg-gray-200 bg-gray-100 rounded-2xl cursor-pointer transition-all group">
          <div className="flex items-center gap-4 px-4 pt-4">
            <Image
              src="/images/profile.png"
              alt="profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <h2 className="text-sm font-semibold">John Doe - @johndoe</h2>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </div>
          </div>

          <div className="relative h-52">
            <Image
              src="/images/profile.png"
              alt="profile"
              fill
              className="aspect-square min-h-52 object-cover bg-zinc-700"
            />
          </div>
          <div className="px-4">
            <p className="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quia.
            </p>
          </div>

          <div className="flex items-center gap-2 pb-4 px-4">
            <Button>
              <ThumbsUp />
            </Button>
            <CommentButton />
          </div>
        </div>
      ))}
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
