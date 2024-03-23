import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/ui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "components/ui"

import { Chat } from 'components';

const AIAvatar = () => {
  return (
    <PopoverAnchor asChild>
      <Avatar className='fixed bottom-6 right-3 z-50 w-12 h-12 shadow-xl bg-white dark:bg-stone-900 border border-double border-4 border-stone-300'>
        <AvatarImage src="svg/logo_color.svg" alt="AI Demo" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
    </PopoverAnchor>
  )
}

export const ChatPopover = () => {
  return (
    <Popover modal>
      <PopoverTrigger>
        <AIAvatar />
      </PopoverTrigger>
      <PopoverContent
        className='w-[51vw] mb-9'
        side='left'
        align='start'
        sideOffset={33}
      >
        <Chat/>
      </PopoverContent>
    </Popover>
  )
}
