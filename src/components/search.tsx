"use client";

import type React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search as SearchIcon, X, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Root as MusicType } from "@/types/result";

type SearchProps = {
  // Dispatch<SetStateAction<Item>>
  onChange: React.Dispatch<
    React.SetStateAction<MusicType["tracks"]["items"][0]>
  >;
};

export default function Search({ onChange }: SearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<
    MusicType["tracks"]["items"]
  >([] as MusicType["tracks"]["items"]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".search-container")) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simulate search with debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue.trim() !== "") {
        searchSong(searchValue);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(handler);
  }, [searchValue]);

  async function searchSong(query: string) {
    setIsLoading(true);
    const res = await fetch(
      `/api/spotify/search?q=${encodeURIComponent(query)}`
    );
    const data: MusicType["tracks"]["items"] = await res.json();
    if (res.ok) {
      setSearchResults(data);
    } else {
      console.error("Search failed:", data);
      setSearchResults([]);
    }
    setIsLoading(false);
  }

  const handleClear = () => {
    setSearchValue("");
    setShowResults(false);
  };

  const handleResultClick = (result: MusicType["tracks"]["items"][0]) => {
    console.log("Selected:", result);
    setSearchValue(
      `${result.name} - ${result.artists
        .map((artist) => artist.name)
        .join(", ")}`
    );
    onChange(result);
    setShowResults(false);
  };

  return (
    <div className="w-full relative search-container">
      <div className="relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Cari judul lagu di sini..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-10 h-12 text-base"
            onFocus={() => searchValue && setShowResults(true)}
          />
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-muted">
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-1 max-h-96 overflow-y-auto z-50 shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center justify-between group">
                  <div className="flex items-center">
                    <Image
                      width={40}
                      height={40}
                      src={result.album.images[0]?.url}
                      alt={result.name}
                      className="w-10 h-10 rounded mr-3"
                    />
                    <div>
                      <div className="font-medium text-sm">{result.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {result.artists.map((artist) => artist.name).join(", ")}
                      </div>
                    </div>
                  </div>
                  {result.name && (
                    <TrendingUp className="h-3 w-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          ) : searchValue ? (
            <div className="p-4 text-center text-muted-foreground">
              No results found for `&quot;`{searchValue}`&quot;`
            </div>
          ) : null}

          {/* Recent Searches */}
        </Card>
      )}
    </div>
  );
}
