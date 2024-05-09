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
        src='/img/themes/pacifica/pacifica_main.png'
        width='420'
        height='100'
      />
        <h3 className='italic text-2xl font-semibold mb-9 mt-6 text-[#E14462]'>Where Organizations find their Spirit.</h3>
        <div className='leading-loose space-y-6 mt-6'>
          <p>
          Welcome to Pacifica, where innovation meets human resources excellence. As a premier consulting firm,
          we specialize in revolutionizing HR practices through the seamless integration of data, analytics, and AI.
          Our mission is simple yet transformative: to empower organizations with actionable insights across key HR
          functions, including recruitment, payroll, retention, and DEI initiatives.
          </p>
          <Image
            src='https://plus.unsplash.com/premium_photo-1661901829247-0358bd917858?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            width='750'
            height='500'
            alt='stock pacifica photo'
          />
          <p>
          With a keen focus on leveraging
          advanced technologies, we guide our clients towards informed decisions that enhance efficiency, productivity,
          and employee satisfaction. From unraveling recruitment challenges to optimizing payroll processes, Pacifica
          is your trusted partner in navigating the dynamic landscape of the modern workplace.
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
        landscape, Pacifica uncovers valuable insights that enable clients to enhance their recruitment
        strategies, streamline payroll operations, and boost employee retention rates. Through a combination
        of cutting-edge technology and expert human resources knowledge, Pacifica empowers organizations to
        navigate the complexities of the modern workplace with confidence and precision.
        </p>
        <Image
          src='https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          width='750'
          height='500'
          alt='stock pacifica photo'
        />
        <p>
        At Pacifica, we redefine the HR landscape through a blend of cutting-edge technology and expert
        human resources acumen. Join us on a journey of transformation, where
        data-driven methodologies pave the way for a future of unparalleled organizational excellence.
        </p>
      </div>
    </div>
  )
}
