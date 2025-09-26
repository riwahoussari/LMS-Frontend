import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function MyPagination({
  page,
  setPage,
  MAX_PAGES,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  MAX_PAGES: number;
}) {
  return (
    <Pagination>
      <PaginationContent>
        {/* previous */}
        <PaginationItem>
          <PaginationPrevious
            className={
              page == 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
            onClick={() => setPage(page == 0 ? 0 : page - 1)}
          />
        </PaginationItem>

        <p className="mx-3">
          {page + 1} / {MAX_PAGES}
        </p>

        {/* next */}
        <PaginationItem>
          <PaginationNext
            className={
              page + 1 == MAX_PAGES
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={() =>
              setPage(page + 1 == MAX_PAGES ? MAX_PAGES - 1 : page + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
