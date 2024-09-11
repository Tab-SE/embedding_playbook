import Image from 'next/image';

import { DisplayContextProvider } from 'components/context';
import { Demo } from 'components';

const Intro = () => {
  return (
    <div>
      {/*<h1 className='text-5xl font-bold mb-9'>Commonwealth</h1>*/}
      <Image
        src='/img/other/commonwealth_logo.jpg'
        width='415'
        height='250'
        alt='company logo'
      />
      <h1 className='text-2xl font-bold mb-10 mt-10'>Welcome to the power of partnership.</h1>
        <div className='space-y-0'>
          <p className='leading-loose font-bold'>
            Welcome to Commonwealth.
          </p>
          <p className='leading-relaxed pb-10'>
            You have a vision as an independent financial advisor.
            Realize it with a partner that puts you first and powers you forward with sophisticated solutions, 
            specialized consulting, and intuitive tools.
          </p>
          <Image
            src='/img/other/client2.png'
            width='750'
            height='500'
            alt='stock photo'
          />
        </div>
    </div>
  )
}

const Outro = () => {
  return (
    <div className='overflow-hidden leading-relaxed'>
      <p className='text-2xl font-bold mt-5'>
        Break away and break through
      </p>
      <ol className='list-decimal leading-loose text-2xl mt-3 ml-14'>
        <li>Tailored Business Strategies</li>
        <li>Advanced Planning & Research</li>
        <li>Complete Marketing Support</li>
        <li>Collaborative Compliance</li>
        <li>Powerful Technology</li>
      </ol>
      <p className='mt-10'>
        Build your business with comprehensive, integrated capabilities that accentuate your strengths 
        and a partner who is as invested in your success as you are.
      </p>
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
