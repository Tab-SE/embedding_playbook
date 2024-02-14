import { Analytics } from './Analytics';

export const Hero = (props) => {
  const { children, src, width, height, hideTabs, device, toolbar } = props;

  return (
    <div className='mt-9 grid grid-cols-1 md:grid-cols-12 md:gap-9'>
      <div className='col-span-4'>
        {children}
      </div>
      <div className='col-span-8'>
        <Analytics 
          src={src}
          width={width}
          height={height}
          hideTabs={hideTabs}
          device={device}
          toolbar={"hidden"}
        />
      </div>
    </div>
  );
}
