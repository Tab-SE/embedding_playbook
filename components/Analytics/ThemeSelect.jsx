import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

import { cn } from "utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui";
import { Button } from "components/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "components/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/ui";

const groups = [
  {
    label: "Default",
    teams: [
      {
        label: "Superstore Analytics",
        value: "superstore",
      },
    ],
  },
  {
    label: "Retail",
    teams: [
      {
        label: "Northern Trail Outfitters",
        value: "nto",
      },
    ],
  },
];


export const ThemeSelect = (props) => {
  const { className, setTheme } = props;
  const [open, setOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState(
    groups[0].teams[0]
  );

  React.useEffect(() => {
    setTheme(selectedTeam);
  }, [selectedTeam, setTheme]);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn("justify-between text-lg md:text-xl font-bold tracking-tight p-6 dark:bg-stone-900", className)}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage
              src={`img/themes/${selectedTeam.value}.png`}
              alt={selectedTeam.label}
            />
            <AvatarFallback>&nbsp;</AvatarFallback>
          </Avatar>
          {selectedTeam.label}
          <CaretSortIcon className="ml-3 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList className="dark:bg-stone-700">
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No team found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.teams.map((team) => (
                  <CommandItem
                    key={team.value}
                    onSelect={() => {
                      setSelectedTeam(team)
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`img/themes/${team.value}.png`}
                        alt={team.label}
                      />
                      <AvatarFallback>&nbsp;</AvatarFallback>
                    </Avatar>
                    {team.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedTeam.value === team.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  )
}
