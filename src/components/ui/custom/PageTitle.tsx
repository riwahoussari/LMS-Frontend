export default function PageTitle({ children }: { children: string }) {
  return <h1 className="font-bold text-3xl pb-5 border-b-2">{children}</h1>;
}
