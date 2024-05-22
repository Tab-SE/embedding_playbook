import { useState, useEffect } from "react";
import {
  CaretSortIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/ui";
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

import { cn } from "utils";
import { settings }  from "settings";

export const ThemeSelector = (props) => {
  const { className, setTheme } = props;
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(
    () => {
      try {
        return findDefaultTheme(settings);
      } catch (error) {
        console.error(error.message);
      }
    }
  );

  const orderedThemes = organizeThemes(settings);

  useEffect(() => {
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
          className={cn("justify-between text-lg md:text-2xl font-bold tracking-tight p-6 text-white border-none bg-transparent dark:bg-stone-900", className)}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage
              src={`img/themes/${selectedTeam.logo}`}
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
            <CommandEmpty>No Theme found.</CommandEmpty>
            {orderedThemes.map((theme) => (
              <CommandGroup key={theme.label} heading={theme.label}>
                {theme.themes.map((theme) => (
                  <CommandItem
                    key={theme.label}
                    onSelect={() => {
                      setSelectedTeam(theme)
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`img/themes/${theme.logo}`}
                        alt={theme.label}
                      />
                      <AvatarFallback>&nbsp;</AvatarFallback>
                    </Avatar>
                    {theme.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedTeam.label === theme.label
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

const findDefaultTheme = settings => {
  if (!settings.themes || !Array.isArray(settings.themes)) {
    throw new Error('Themes array not found or not an array: provided settings.json is missing a themes array');
  }
  // only a single default theme is accepted
  let defaultTheme = null;
  for (const theme of settings.themes) {
    if (theme.type === 'default') {
      // if default theme already found, throw error
      if (defaultTheme !== null) {
        throw new Error('Multiple default themes found: only one default theme allowed in settings.json');
      }
      defaultTheme = theme;
    }
  }
  if (!defaultTheme) {
    throw new Error('Default theme not found: declare a default theme in settings.json');
  }
  return defaultTheme;
}

// creates an object with arrays listing themes by type
function organizeThemes(settings) {
  const organizedThemes = [];

  settings.themes.forEach(theme => {
    const existingGroup = organizedThemes.find(group => group.label === theme.type);
    if (existingGroup) {
      existingGroup.themes.push(theme);
    } else {
      // capitalize first letter in type
      const label = theme.type.replace(/\b\w/g, char => char.toUpperCase());
      organizedThemes.push({ label: label, name: theme.type, themes: [theme] });
    }
  });

  return organizedThemes;
}
