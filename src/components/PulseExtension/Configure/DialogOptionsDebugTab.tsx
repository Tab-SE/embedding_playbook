'use client';
import {
  Checkbox
} from '../../ui';


export const OptionsDebugTab = ({
  debug,
  setDebug,
}) => {

  return (
    <div>
      <span className="text-2xl font-extrabold">Debug</span>
      <div>
        <label htmlFor="debug" className="mr-3">
          Debug Mode:
        </label>
        <Checkbox
          title="Debug Mode: Check to show detailed troubleshooting information in the extension and the console."
          id="debug"
          checked={debug}
          onCheckedChange={(e) => {
            setDebug(e);
          }}
        />
      </div>
    </div>
  );
};
