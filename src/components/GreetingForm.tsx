"use client";

import { useState } from "react";
import Search from "./search";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Root as MusicType } from "@/types/result";
import ListData from "./ListData";

export default function GreetingForm() {
  // This component is a simple greeting form with a search bar, input for name, textarea for message, and a submit button.
  //state
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
        <Button className="mb-4">Kirim Pesan</Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Kirim Pesan</h2>
      <Tabs defaultValue="beranda">
        <TabsList>
          <TabsTrigger value="beranda">Beranda</TabsTrigger>
          <TabsTrigger value="form">Kirim Pesan</TabsTrigger>
        </TabsList>
        <TabsContent value="beranda">
          <ListData />
        </TabsContent>
        <TabsContent value="form">
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
        </TabsContent>
      </Tabs>
    </>
  );
}
