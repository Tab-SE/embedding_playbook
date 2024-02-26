import { DemoContextProvider } from './context';
import { Analytics } from './Analytics';

export const Hero = (props) => {
  const { children } = props;

  return (

    <DemoContextProvider>
      <Md props={props} snippet={children} />
      <Lg props={props} snippet={children} />
    </DemoContextProvider>
  );
}

const Md = (props) => {
  const { snippet, src, width, height, hideTabs, device } = props;

  return (
    <div className='lg:hidden space-y-6'>
      <Intro />
      <Analytics 
        src={src}
        width={width}
        height={height}
        hideTabs={hideTabs}
        device={device}
        toolbar={"hidden"}
      />
      <EmbedCode snippet={snippet} />
    </div>
  )
}

const Lg = (props) => {
  const { snippet, src, width, height, hideTabs, device } = props;

  return (
    <div className='hidden lg:grid mt-9 grid-cols-1 md:grid-cols-12 md:gap-9'>
      <div className='col-span-4'>
        <Intro />
        <EmbedCode snippet={snippet} />
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
  )
}

const Intro = () => {
  return (
    <div>
      <h1 className='text-5xl font-bold mb-9'>Embed Tableau</h1>
        <div className='leading-loose space-y-6'>
          <p>Tableau is the world's leading end-to-end data and analytics platform.</p>
          <p>
            Leverage the analytical powerhouse of Tableau to analyze and visualize data. 
            The Embedding Playbook teaches you how to compose Tableau's varied product capabilities 
            into applications that thrill customers, coworkers, and friends!
          </p>
          <p>
            Beyond creating visual representations of data, Tableau provides 
            the greatest benefits as it helps people discover what information is valuable to others. 
            It enables users to analyze data and build the interfaces that represent them with unmatched speed 
            and flexibility resulting in a springboarding of ideas into value.
          </p>
        </div>
    </div>
  )
}

const EmbedCode = (props) => {
  const { snippet } = props;
  return (
    <div>
      { snippet }
    </div>
  )
}
