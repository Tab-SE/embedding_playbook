import Analytics from './Analytics';

export default function Hero(props) {
  const { src, width, height, hideTabs, device } = props;

  return (
    <div className='mt-12 grid grid-cols-1 md:grid-cols-8 md:gap-16'>
      <div className='col-span-3'>
        <h1 className='nx-mt-2 nx-text-4xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100'>
          Tableau Embedding Playbook
        </h1>
        <p className='nx-mt-6 nx-leading-7 first:nx-mt-0'>
          Tableau is the world's leading end-to-end data and analytics platform.
        </p>

        <p className='nx-mt-6 nx-leading-7 first:nx-mt-0'>
          Leverage the analytical powerhouse of Tableau to analyze and visualize data. 
          The Embedding Playbook teaches you how to compose Tableau's varied product capabilities 
          into applications that thrill customers, coworkers, and friends!
        </p>

        <p className='nx-mt-6 nx-leading-7 first:nx-mt-0'>
          Beyond creating visual representations of data, Tableau provides 
          the greatest benefits as it helps people discover what information is valuable to others. 
          It enables users to analyze data and build the interfaces that represent them with unmatched speed 
          and flexibility resulting in a springboarding of ideas into value.
        </p>
      </div>
      <div className='col-span-5'>
        <Analytics 
          src={src}
          width={width}
          height={height}
          hideTabs={hideTabs}
          device={device}
        />
      </div>
    </div>
  );
}
