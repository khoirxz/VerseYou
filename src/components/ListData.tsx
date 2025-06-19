"use client";

import { useEffect, useState } from "react";

export default function ListData() {
  const [data, setData] = useState([]);

  useEffect(() => {
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
        setData(data);
      } else {
        console.error("Failed to fetch data:", data.error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">List Data</h2>
      {/* List items will be rendered here */}
      {data.length > 0 ? (
        <ul className="space-y-2">
          {data.map((item, index) => (
            <li key={index} className="p-2 border rounded">
              <h3 className="font-bold">{item.name}</h3>
              <p>{item.message}</p>
              <p className="text-sm text-gray-500">Music ID: {item.music}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  );
}
