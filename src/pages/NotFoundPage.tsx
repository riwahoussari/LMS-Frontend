import ErrorCard from "@/components/shared/ErrorCard";

export default function NotFoundPage() {
  return (
    <main className="h-[90vh] flex items-center justify-center">
      <ErrorCard title="Page Not Found" message="The page your were looking was not found." />
    </main>
  );
}