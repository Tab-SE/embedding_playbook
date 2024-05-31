import Image from 'next/image';

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

const Intro = () => {
  return (
    <div className=''>
      <Logo
        src='/img/themes/cumulus-core-primary-logo-wealth-blue.png'
        width='420'
        height='100'
      />
        <h3 className='italic text-2xl font-semibold mb-9 mt-6 text-[#2a94d6]'>Elevate Your Wealth with Data Insights</h3>
        <div className='leading-loose space-y-6 mt-6'>
          <p>
          At Cumulus Wealth, our mission is to empower individuals, families, and institutions to achieve lasting financial prosperity through personalized wealth management solutions and unwavering commitment to excellence. We are dedicated to:
          </p>
          <p>
          Serving as a trusted partner, providing expert guidance and tailored strategies that align with our clients' unique goals, values, and risk tolerance, enabling them to make informed decisions about their financial future.
          </p>
          <Image
            src='https://plus.unsplash.com/premium_photo-1661634003229-975f2828c45a?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            width='750'
            height='500'
            alt='stock pacifica photo'
          />
        </div>
    </div>
  )
}

const Outro = (props) => {
  const { snippet } = props;
  return (
    <div className='overflow-hidden'>
      <div className='leading-loose space-y-6 mt-6'>
        <p>
          Offering a comprehensive suite of wealth management services, including investment management, financial planning, estate planning, and philanthropic advisory, delivered with a holistic approach that addresses every aspect of our clients' financial well-being.
        </p>
        <p>
          Upholding the highest standards of integrity, ethics, and transparency in all our dealings, fostering an environment of trust and accountability that puts our clients' interests first.
        </p>
      </div>
    </div>
  )
}
