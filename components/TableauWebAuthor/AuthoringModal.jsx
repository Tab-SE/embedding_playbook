import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "components/ui";

export const AuthoringModal = (props) => {
  const { } = props;

  return (
    <DialogContent className="max-w-full w-max dark:bg-stone-900">
      <DialogHeader className="ml-6">
        <DialogTitle className="text-3xl">
          Title Text
        </DialogTitle>
        <DialogDescription>
        Description text
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  )
}
