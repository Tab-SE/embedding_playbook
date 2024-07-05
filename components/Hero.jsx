import Image from 'next/image';
import Link from 'next/link';

import { Button } from 'components/ui';

import { DisplayContextProvider } from 'components/context';
import { Demo, Logo } from 'components';

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

const HeroContent = (props) => {
  const { hideMetrics, hideSheets, snippet } = props;

  return (
    <Demo
      hideMetrics={hideMetrics}
      hideSheets={hideSheets}
    />
  )
}

const Intro = () => {
  return (
    <div className=''>
      <Logo
        src='/img/themes/pacifica/pacifica.png'
        width='420'
        height='100'
      />
        <h3 className='italic text-2xl font-semibold mb-9 mt-6'>
        TRANSFORM YOUR <span className='text-[#FD4926]'>PRICING</span> PROCESS
        </h3>
        <div className='leading-loose space-y-6 mt-6'>
          <p>
          Pacifica puts pricing at the heart of your business, transforming how you use data to price and sell.
          See what the industry's leading cloud-native pricing, CPQ, and revenue optimization software can do for
          your business.
          </p>
          <Button className="bg-[#FD4926] ml-12 mt-6">
            <Link
              href="/optimization"
            >
            Contact Us
            </Link>
          </Button>
          <Image
            src='/img/themes/pacifica/pacifica.png'
            width='750'
            height='500'
            alt='stock photo'
          />
          <p>
          Pacifica helps businesses put pricing at the heart of their business by managing the entire pricing
          lifecycle with leading CPQ, price management & optimzation, and Revenue Intelligence applications.
          Pacifica's data science, cloud-native software and passion for customer success deliver the highest ROI,
          fastest time to value and highest customer satisfaction.
          </p>
        </div>
    </div>
  )
}

const Outro = () => {
  return (
    <div className='overflow-hidden'>
      <div className='leading-loose space-y-6 mt-6'>
        <h4 className='font-semibold'>Upcoming Event</h4>
        <h3 className='italic text-2xl font-semibold mb-9 mt-6'>
          Pacifica <span className='text-[#FD4926]'>Convention</span> 2024
        </h3>
        <Image
          src='/img/pacifica/pacifica.png'
          width='750'
          height='500'
          alt='stock photo'
        />
        <p>
        MindShare returns to Austin, Texas, on May 21 – 23, 2024, and will be our biggest yet!
        The 3-day event will bring together pricing industry experts, visionaries, executives,
        practitioners, and partners to share market trends, explore new ideas, and provide practical,
        real-life stories on how to capture value across the entire pricing lifecycle.
        </p>
      </div>
    </div>
  )
}
