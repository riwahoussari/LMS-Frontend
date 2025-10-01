import { useAsync } from "@/hooks/useAsync";
import {
  USER_SORT_OPTIONS,
  type Role,
  type UserDto,
} from "@/lib/constants/users";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SortIconSvg from "@/components/ui/custom/SortIconSvg";
import SearchBar from "@/components/ui/custom/SearchBar";
import MyDialog from "@/components/ui/custom/MyDialog";
import {
  SortDirectionSelect,
  SortOptionSelect,
} from "@/components/forms/SortOptionSelect";
import MyPagination from "@/components/ui/custom/MyPagination";
import { getUsers } from "@/services/users";
import { RoleSelect } from "@/components/forms/RoleSelect";
import UserCard, { SkeletonUserCard } from "@/components/users/UserCard";
import { Funnel } from "lucide-react";

export default function UsersPage() {
  // filters
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>();
  // sorting
  const [sortBy, setSortBy] = useState(USER_SORT_OPTIONS[0]?.value || "");
  const [sortAsc, setSortAsc] = useState(true);
  // pagination
  const limit = 2;
  const [page, setPage] = useState(0);

  const query = {
    fullname,
    email,
    role,
    sortBy,
    sortAsc,
    limit,
    offset: page * limit,
  };
  const { data, error } = useAsync(getUsers, [query], [query]);

  useEffect(() => {
    if (error) toast.error("Failed to load courses");
  }, [error]);

  return (
    <main>
      <div className="flex items-end flex-wrap gap-4">
        <SearchBar
          placeholder="Search by fullname"
          value={fullname}
          onChange={setFullname}
        />

        <SearchBar
          placeholder="Search by email"
          value={email}
          onChange={setEmail}
        />

        {/* filtering dialog */}
        <MyDialog
        icon={<Funnel className="w-5! h-5!" />}
          onClear={() => {
            setRole(undefined);
          }}
        >
          <RoleSelect role={role} setRole={setRole} />
        </MyDialog>

        {/* Sorting Dialog */}
        <MyDialog
          icon={<SortIconSvg className="scale-150" />}
          onClear={() => {
            setSortBy(USER_SORT_OPTIONS[0]?.value || "");
            setSortAsc(true);
          }}
        >
          <SortOptionSelect
            options={USER_SORT_OPTIONS}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <SortDirectionSelect sortAsc={sortAsc} setSortAsc={setSortAsc} />
        </MyDialog>
      </div>

      {/* cards */}
      <UserList data={data?.items} />

      {/* pagination */}
      {data && data.items.length > 0 && (
        <MyPagination
          MAX_PAGES={Math.ceil(data.total / limit)}
          page={page}
          setPage={setPage}
        />
      )}
    </main>
  );
}

function UserList({ data }: { data?: UserDto[] | null }) {
  if (!data) {
    return (
      <div className="flex flex-wrap justify-start gap-16">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonUserCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-start gap-16">
        {data.length == 0 ? (
          <p>No courses found.</p>
        ) : (
          data.map((user) => <UserCard key={user.id} {...user} />)
        )}
      </div>
    </div>
  );
}
