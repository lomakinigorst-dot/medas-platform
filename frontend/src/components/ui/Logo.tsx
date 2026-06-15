import Image from "next/image";

export function Logo({
  width = 140,
  height = 40,
  priority = false,
  className = "",
}: {
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/logos/Medas_gor_b.svg"
      alt="MEDAS"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={`object-contain${className ? ` ${className}` : ""}`}
    />
  );
}
