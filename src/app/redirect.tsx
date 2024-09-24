"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function Redirect() {
  const [seconds, setSeconds] = useState(8);
  const prevented = useRef(false);

  useEffect(() => {
    const token = setInterval(() => {
      setSeconds((s) => {
        // side effect within a setState #yolo
        if (s === 0) {
          clearInterval(token);
          if (!prevented.current) {
            window.location.href =
              "https://en.gw2treasures.com/homestead/materials";
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(token);
  }, []);

  return (
    <div className="p-2 text-center">
      <p className="font-bold">
        Homestead mats has been integrated into{" "}
        <a
          className="underline text-blue-700"
          href="https://en.gw2treasures.com/homestead/materials"
        >
          gw2treasures.com
        </a>
      </p>
      <p className="p-2">
        Redirecting you there in {Math.max(0, seconds)} seconds…
      </p>
      <p>
        Click{" "}
        <Link
          className="underline text-blue-700"
          href="mats"
          onClick={() => (prevented.current = true)}
        >
          here
        </Link>{" "}
        if you still want to use the old version, but this site will be removed
        soon™
      </p>
    </div>
  );
}
