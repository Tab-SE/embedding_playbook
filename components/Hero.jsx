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
        <h3 className='italic text-2xl font-semibold mb-9 mt-6 text-[#2a94d6]'>Where Organizations find their Spirit.</h3>
        <div className='leading-loose space-y-6 mt-6'>
          <p>
          Welcome to Pacifica, where innovation meets human resources excellence. As a premier consulting firm,
          we specialize in revolutionizing HR practices through the seamless integration of data, analytics, and AI.
          Our mission is simple yet transformative.
          </p>
          <Image
            src='https://plus.unsplash.com/premium_photo-1661634003229-975f2828c45a?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            width='750'
            height='500'
            alt='stock pacifica photo'
          />
          <p>
          With a keen focus on leveraging
          advanced technologies, we guide our clients towards informed decisions that enhance efficiency, productivity,
          and employee satisfaction. From unraveling recruitment challenges.
          </p>
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
        With a focus on data, analytics, and AI, Pacifica stands out as a forward-thinking
        partner for businesses seeking to optimize their HR processes. By delving deep into the data
        landscape, Pacifica uncovers valuable insights that enable clients.
        </p>
        <p>
        At Pacifica, we redefine the HR landscape through a blend of cutting-edge technology and expert
        human resources acumen. Join us on a journey of transformation.
        </p>
      </div>
    </div>
  )
}
