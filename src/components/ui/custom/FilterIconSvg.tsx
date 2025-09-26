import type { SVGProps } from "react";

export default function FilterIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        stroke="var(--color-foreground)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 7h16M7 12h10M11 17h2"
      />
    </svg>
  );
}
