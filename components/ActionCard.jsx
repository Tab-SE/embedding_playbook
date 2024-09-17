import { Button } from "components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui";

import { cn } from 'utils';

export const ActionCard = (props) => {
  const { title, description, buttonTitle, className, onButtonClick } = props;

  return (
    <Card
      className={cn("", className)}
      x-chunk="dashboard-05-chunk-0"
    >
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={onButtonClick}>{buttonTitle}</Button>
      </CardFooter>
    </Card>
  );
};
