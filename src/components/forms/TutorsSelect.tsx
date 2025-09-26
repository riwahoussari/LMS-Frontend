import { getUsers } from "@/services/users";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Props = {
  tutorProfileId: string;
  setTutorProfileId: React.Dispatch<React.SetStateAction<string>>;
};

export default function TutorsSelect({
  tutorProfileId,
  setTutorProfileId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [fullname, setFullname] = useState("");

  const { data: tutors, error } = useCachedAsync(
    `getTutor${fullname}`,
    getUsers,
    [{ role: "tutor", limit: 10, offset: 0, fullName: fullname }],
    [fullname]
  );

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load tutors`);
    }
  }, [error]);

  const selectedTutor = tutors?.items.find(
    (tutor) => tutor.tutorProfile?.id === tutorProfileId
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedTutor
            ? selectedTutor.firstName + " " + selectedTutor.lastName
            : "Select tutor..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            value={fullname}
            onValueChange={setFullname}
            placeholder="Search by fullname..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No tutors found.</CommandEmpty>
            <CommandGroup>
              {tutors?.items.map(
                (tutor) =>
                  tutor.tutorProfile && (
                    <CommandItem
                      key={tutor.tutorProfile.id}
                      value={tutor.firstName + " " + tutor.lastName}
                      onSelect={() => {
                        setTutorProfileId(
                          tutor.tutorProfile!.id == tutorProfileId
                            ? ""
                            : tutor.tutorProfile!.id
                        );
                        setOpen(false);
                      }}
                    >
                      {tutor.firstName} {tutor.lastName}
                      <Check
                        className={cn(
                          "ml-auto",
                          tutorProfileId === tutor.tutorProfile.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  )
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
