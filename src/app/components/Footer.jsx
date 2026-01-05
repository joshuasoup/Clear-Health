import Image from "next/image";
import Logo from "../../assets/images/clearhealthlogo.png";
import Link from "next/link";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

const socials = [
  {
    label: "X",
    href: "https://twitter.com",
    Icon: IconBrandX,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/joshua-souphanthong",
    Icon: IconBrandLinkedin,
  },

  {
    label: "GitHub",
    href: "https://github.com/joshuasoup",
    Icon: IconBrandGithub,
  },
];

const Footer = () => {
  return (
    <footer className="w-full px-3 py-5">
      <div className="max-w-6xl mx-auto border border-gray-200 rounded-xl bg-white shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-3 py-3">
          <div className="flex items-center gap-2 text-gray-500">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition"
                aria-label={label}
              >
                <Icon
                  className="h-5 w-5 text-[#98A2B3]"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-base font-semibold text-gray-900">
                Clear Health
              </span>
            </Link>
          </div>
          <div className="text-xs text-gray-500">
            © 2024 Clear Health. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
