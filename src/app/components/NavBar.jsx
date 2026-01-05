"use client";
import Image from "next/image";
import Link from "next/link";
import medicalLogo from "../../assets/images/clearhealthlogo.png";
import "../../styles/globals.css";

const items = [
  {
    name: "Github",
    link: "https://github.com/joshuasoup/Clear-Health",
  },
];

const Navbar = () => {
  return (
    <nav className="bg-transparent px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={medicalLogo} alt="Logo" width={30} height={30} />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {items.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className="text-sm font-medium text-[var(--muted-ink)] hover:text-[var(--ink)] transition"
            >
              {item.name}
            </Link>
          ))}
          <Link href="/pdf-viewer" className="special-button text-sm px-5 py-2">
            Open viewer
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
