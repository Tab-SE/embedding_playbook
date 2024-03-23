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

const ChatAvatar = () => {
  return (
    <PopoverAnchor asChild>
      <Avatar className='fixed bottom-20 right-5 z-50'>
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
        <ChatAvatar />
      </PopoverTrigger>
      <PopoverContent
        className='w-[39vw] mb-9'
        side='left'
        align='start'
        sideOffset={33}
      >
        <Chat/>
      </PopoverContent>
    </Popover>
  )
}
