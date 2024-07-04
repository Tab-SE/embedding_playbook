import Image from 'next/image';
import Link from 'next/link';

import { Button } from 'components/ui';

import { DisplayContextProvider } from 'components/context';
import { Demo, Logo } from 'components';

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
          <Image
            src='/img/tableau/datadev.png'
            width='750'
            height='500'
            alt='stock photo'
          />
        </div>
    </div>
  )
}

const Outro = (props) => {
  const { snippet } = props;
  return (
    <div className='overflow-hidden'>
      <p>
        Beyond creating visual representations of data, Tableau provides
        the greatest benefits as it helps people discover what information is valuable to others.
        It enables users to analyze data and build the interfaces that represent them with unmatched speed
        and flexibility resulting in a springboarding of ideas into value.
      </p>
      { snippet }
    </div>
  )
}

const HeroContent = (props) => {
  const { hideMetrics, hideSheets, snippet } = props;

  return (
    <div className='grid grid-rows lg:grid-cols-12 space-y-6'>
      <div className='lg:col-span-4 space-y-6 mr-6 mt-16'>
        <Intro />
        <div className='hidden lg:grid'>
          <Outro snippet={snippet} />
        </div>
      </div>
      <div className='lg:col-span-8'>
        <Demo
          hideMetrics={hideMetrics}
          hideSheets={hideSheets}
        />
      </div>
      <div className='grid lg:hidden'>
        <Outro
          snippet={snippet}
        />
      </div>
    </div>
  )
}

export const Hero = (props) => {
  const { children, hideMetrics, hideSheets } = props;

  return (
    <DisplayContextProvider>
      <HeroContent
        hideMetrics={hideMetrics}
        hideSheets={hideSheets}
        snippet={children}
      />
    </DisplayContextProvider>
  );
}
