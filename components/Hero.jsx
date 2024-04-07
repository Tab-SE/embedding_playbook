import { useContext } from 'react';
import { cn } from 'utils';

import { DisplayContextProvider, DisplayContext } from 'components/context';
import { Demo } from 'components';

export const Hero = (props) => {
  const { children } = props;

  return (
    <DisplayContextProvider>
      <Md props={props} snippet={children} />
      <Lg props={props} snippet={children} />
    </DisplayContextProvider>
  );
}

const Md = (props) => {
  const { snippet, src, width, height, hideTabs, device } = props;
  const { display } = useContext(DisplayContext);

  return (
    <div className='lg:hidden space-y-6'>
      <div className='my-12'>
        <div className={cn(display === 'minimized' ? '' : 'hidden')}>
          <Intro />
        </div>
        <div className='my-12'>
          <Demo
            src={src}
            width={width}
            height={height}
            hideTabs={hideTabs}
            device={device}
            toolbar={"hidden"}
          />
        </div>
        <div className={cn(display === 'minimized' ? '' : 'hidden')}>
          <EmbedCode
            snippet={snippet}
          />
        </div>
      </div>
    </div>
  )
}

const Lg = (props) => {
  const { snippet, src, width, height, hideTabs, device } = props;
  const { display } = useContext(DisplayContext);

  return (
    <div className='hidden lg:grid mt-9 grid-cols-1 md:grid-cols-12 md:gap-9'>
      <div className={cn(display === 'minimized' ? 'col-span-4' : 'hidden')}>
        <Intro />
        <EmbedCode snippet={snippet} />
      </div>
      <div className={cn(display === 'minimized' ? 'col-span-8' : 'col-span-12')}>
        <Demo
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
    <div className='my-9'>
      { snippet }
    </div>
  )
}
