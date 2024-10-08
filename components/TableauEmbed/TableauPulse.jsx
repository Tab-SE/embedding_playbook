import { forwardRef, useRef } from 'react';

import { TableauAuth } from 'components';

//import { TableauPulse } from 'https://online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';

/*
const pulse = new TableauPulse();

pulse.src = 'http://my-server/scope/scoped-123-1';
pulse.token = 'someCAtoken';
pulse.disableExploreFilter = true;

document.getElementById('pulseJsContainer').appendChild(pulse);
*/
export const TableauPulse = forwardRef(function TableauPulse(props, ref) {
  const {
    src,
    className,
    height,
    width,
    hideTabs,
    toolbar,
    isPublic,
    WebEdit = false,
    customToolbar = true,
    layouts
  } = props;

    // to be used if parent did not forward a ref
    const localRef = useRef(null);
    // Use the forwarded ref if provided, otherwise use the local ref
    const innerRef = ref || localRef;

    return (
      <div className={className}>
        <TableauAuth
          src={src}
          ref={innerRef}
          className={className}
          height={height}
          width={width}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          isPublic={isPublic}
          //WebEdit={WebEdit}
          //customToolbar={customToolbar}
          layouts={layouts}
        />
      </div>
    )
  });
