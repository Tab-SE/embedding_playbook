import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from "components/ui";

import { TableauEmbed } from 'components';

export const Explore = (props) => {
  const { title, description, src } = props;

  return (
    <DialogContent className="max-w-[93vw] h-[93vh] dark:bg-stone-900" >
      <DialogHeader className="ml-6">
        <DialogTitle className="text-3xl">
          {title}
        </DialogTitle>
      </DialogHeader>
      <div className="min-h-[80vh]">
        <TableauEmbed
          src={src}
          height='82vh'
          width='100%'
          WebEdit
          customToolbar={false}
        />
      </div>
    </DialogContent>
  )
}
