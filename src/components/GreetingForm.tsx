"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import Search from "./search";
import ListData from "./ListData";
import { Root as MusicType } from "@/types/result";

export default function GreetingForm() {
  // This component is a simple greeting form with a search bar, input for name, textarea for message, and a submit button.
  //state
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [music, setMusic] = useState<MusicType["tracks"]["items"][0]>(
    {} as MusicType["tracks"]["items"][0]
  );

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/greeting", {
      method: "POST",
      body: JSON.stringify({ name, message, music: music.id }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Failed to save greeting:", data.error);
      return;
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-6">
        <Button className="mb-4">Beranda</Button>
        <Button className="mb-4" onClick={() => setOpen(true)}>
          Kirim Pesan
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Kirim Pesan</DialogTitle>

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <Search onChange={setMusic} />
            <Input
              placeholder="Nama atau Seseorang"
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              placeholder="Pesan yang kamu ingin sampaikan"
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button className="w-full" type="submit">
              Kirim
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ListData />
    </>
  );
}
