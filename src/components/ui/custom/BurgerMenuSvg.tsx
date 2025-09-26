// if isOpen === flase the icon will look like a burger menu icon
// if isOpen === true the icon will look like an "X"

export default function BurgerMenuSvg({ isOpen }: { isOpen: boolean }) {
  return (
    <svg className="cursor-pointer" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="burger-menu-icon">
        {/* Top line - rotates down when isOpen is true */}
        <path
          className={
            "origin-top-left duration-300 ease-in-out " +
            (isOpen ? "translate-x-2 rotate-45" : " translate-y-1")
          }
          id="top-line"
          opacity={1}
          d="M27 2H1"
          stroke="var(--color-foreground)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom line - rotates up when isOpen is true */}
        <path
          className={
            "origin-bottom-left duration-300 ease-in-out " +
            (isOpen ? " translate-x-2 -rotate-45" : " -translate-y-1")
          }
          id="bottom-line"
          opacity={1}
          d="M27 21H1"
          stroke="var(--color-foreground)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}