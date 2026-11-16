import Image from "next/image";

export function BrandLogo() {
  return (
    <span className="mino-wordmark">
      <Image
        src="/brand/svg/mino-wordmark-black.svg"
        alt="Mino"
        width={610}
        height={211}
        className="dark:hidden"
        unoptimized
      />
      <Image
        src="/brand/svg/mino-wordmark-white.svg"
        alt="Mino"
        width={610}
        height={211}
        className="hidden dark:block"
        unoptimized
      />
    </span>
  );
}
