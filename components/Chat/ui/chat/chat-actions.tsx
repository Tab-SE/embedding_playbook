import { IconPlayerPause, IconRefresh } from '@tabler/icons-react';
import { Button } from "../button";
import { ChatHandler } from "./chat.interface";

export default function ChatActions(
  props: Pick<ChatHandler, "stop" | "reload"> & {
    showReload?: boolean;
    showStop?: boolean;
  },
) {
  return (
    <div className="space-x-4">
      {props.showStop && (
        <Button variant="outline" size="sm" onClick={props.stop}>
          <IconPlayerPause stroke={2} className="mr-2 h-4 w-4" />
          Stop generating
        </Button>
      )}
      {props.showReload && (
        <Button variant="outline" size="sm" onClick={props.reload}>
          <IconRefresh className="mr-2 h-4 w-4" />
          Regenerate
        </Button>
      )}
    </div>
  );
}
