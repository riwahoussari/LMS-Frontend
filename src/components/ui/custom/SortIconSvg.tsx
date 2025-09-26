import type { SVGProps } from "react";

export default function SortIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="var(--color-foreground)"
        d="M5.477 7.962a.75.75 0 0 0 1.046 1.076L5.477 7.962ZM9.6 5h.75a.75.75 0 0 0-1.273-.538L9.6 5Zm-.75 14a.75.75 0 0 0 1.5 0h-1.5Zm9.673-2.962a.75.75 0 1 0-1.046-1.076l1.046 1.076ZM14.4 19h-.75a.75.75 0 0 0 1.273.538L14.4 19Zm.75-14a.75.75 0 0 0-1.5 0h1.5ZM6.523 9.038l3.6-3.5-1.046-1.076-3.6 3.5 1.046 1.076ZM8.85 5v14h1.5V5h-1.5Zm8.627 9.962-3.6 3.5 1.046 1.076 3.6-3.5-1.046-1.076ZM15.15 19V5h-1.5v14h1.5Z"
      />
    </svg>
  );
}
