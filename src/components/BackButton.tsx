"use client";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BackButton() {
  const pathname = usePathname();

  if (pathname.startsWith("/bike/")) {
    return (
      <Link
        href="/bikes"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium gap-2"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to Bikes
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium gap-2"
    >
      <FontAwesomeIcon icon={faArrowLeft} />
      Back to Home
    </Link>
  );
}
