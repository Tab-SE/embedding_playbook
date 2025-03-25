import Image from 'next/image';

import { DisplayContextProvider } from 'components/context';
import { Demo } from 'components';

const Intro = () => {
  return (
    <div>
      {/*<h1 className='text-5xl font-bold mb-9'>Commonwealth</h1>*/}
      <Image
        src='/img/other/cambridge_logo_1.png'
        width='415'
        height='250'
        alt='company logo'
      />
      <h1 className='text-2xl font-bold mb-10 mt-10'>Celebrating Something Wonderful</h1>
        <div className='space-y-0'>
          <p className='leading-loose font-bold'>
            Welcome to Cambridge.
          </p>
          <p className='leading-relaxed pb-10'>
          We are innovators, problem solvers, and game changers. We are independent. We are Cambridge.
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
        Your Business. Your Way.
      </p>
      <ol className='list-decimal leading-loose text-2xl mt-3 ml-14'>
        <li>Control Your Journey</li>
        <li>Discover a New Level of Technology</li>
        <li>Independence Focused on You</li>
        <li>Support at Every Turn</li>
        <li>Join the Cambridge Community</li>
      </ol>
      <p className='mt-10'>
      We believe culture and success go hand in hand. Our core values of integrity, commitment, flexibility, and kindness have shaped our journey and kept us centered on our purpose of serving independent financial advisors and their clients.
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
