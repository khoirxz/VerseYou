"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Search from "@/components/search";
import ListData from "@/components/ListData";

import { Root as MusicType } from "@/types/result";
import { GreetingData } from "@/types/greeting";
import { Session } from "@/types/session";

export default function HomeSection({ session }: { session: Session }) {
  // This component is a simple greeting form with a search bar, input for name, textarea for message, and a submit button.
  const [data, setData] = useState<GreetingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [open, setOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [music, setMusic] = useState<MusicType["tracks"]["items"][0]>(
    {} as MusicType["tracks"]["items"][0]
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("/api/greeting", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    // Store the data in state
    if (response.ok) {
      setLoading(false);
      setData(data);
    } else {
      // Handle error case
      setLoading(false);
      console.error("Failed to fetch data:", data.error);
    }
  };

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/greeting", {
        method: "POST",
        body: JSON.stringify({ name, message, music: music.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to save greeting:", data.error);
        return;
      } else {
        console.log("Greeting saved successfully:", data);
        setOpen(false);
        setName("");
        setMessage("");
        setMusic({} as MusicType["tracks"]["items"][0]); // Reset music selection
        fetchData(); // Refresh the list after submission
      }
    } catch (error) {
      console.error("Error saving greeting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between items-center mb-6">
        {session?.user ? (
          <Button className="my-4" onClick={() => setOpen(true)}>
            Kirim Pesan
          </Button>
        ) : (
          <div className="my-4 rounded-md p-4 bg-zinc-100">
            Masuk untuk mengirim pesan
          </div>
        )}
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

      <ListData data={data} loading={loading} />
    </>
  );
}
