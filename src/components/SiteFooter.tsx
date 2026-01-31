import Image from "next/image";

const footerIcons = {
  logo: "/assets/logo.svg",
  socials: "/assets/Group%201000005938.svg",
};

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-[#2e2e2e] text-white">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-6 py-12 md:flex-row md:justify-between">
        <div className="space-y-3">
          <div>
            <Image src={footerIcons.logo} alt="Logo" width={60} height={26} />
          </div>
          <div className="space-y-1 text-[11px] text-white/60">
            <p>Address:</p>
            <p>USA, California</p>
            <p className="pt-2">Contact:</p>
            <p>1800 123 4567</p>
            <p>javaria2@gmail.com</p>
          </div>
          <div className="pt-2">
            <Image
              src={footerIcons.socials}
              alt="Social links"
              width={90}
              height={18}
            />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[10px] text-white/50">
        © 2023 Javaria. All rights reserved.
      </div>
    </footer>
  );
}
