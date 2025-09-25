"use client";

import { Root } from "@/types/result";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { GreetingData } from "@/types/feeds";

export default function ListData({
  data,
  loading,
}: {
  data: GreetingData[];
  loading: boolean;
}) {
  return (
    <div>
      {/* List items will be rendered here */}
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full rounded-sm" />
          <Skeleton className="h-20 w-full rounded-sm" />
          <Skeleton className="h-20 w-full rounded-sm" />
        </div>
      ) : data.length > 0 ? (
        <div className="space-y-2">
          {data.map((item, index) => (
            <Item key={index} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  );
}

const Item = ({ item }: { item: GreetingData }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Root["tracks"]["items"][0] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/spotify/tracks/" + item.music, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setData(data);
        setLoading(false);
      }
    };

    fetchData();
  }, [item]);

  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4">
      <div className="flex items-center space-x-4 mb-2">
        {loading ? (
          <Skeleton className="w-20 h-20 rounded-sm" />
        ) : (
          <Image
            src={data?.album.images[0].url || ""}
            alt="Album Cover"
            width={80}
            height={80}
            priority
            className="rounded-sm"
          />
        )}

        <p>
          {data?.name} - {data?.artists[0].name}
        </p>
      </div>

      <div className="flex flex-col space-y-2 font-[family-name:var(--font-sil)]">
        <p className="">To : {item.name}</p>
        <p className="">{item.message}</p>
      </div>
    </div>
  );
};
