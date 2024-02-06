import { Analytics } from '../components';

export const Hero = (props) => {
  const { children, src, width, height, hideTabs, device, toolbar } = props;

  return (
    <div className='mt-12 grid grid-cols-1 md:grid-cols-8 md:gap-16'>
      <div className='col-span-3'>
        {children}
      </div>
      <div className='col-span-5'>
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
