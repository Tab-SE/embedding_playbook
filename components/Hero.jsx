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
        src='img/themes/pacifica_main.png'
        width='420'
        height='100'
      />
        <h3 className='italic text-2xl font-semibold mb-9 mt-6 text-[#E14462]'>Helping Organizations find their Spirit.</h3>
        <div className='leading-loose space-y-6 mt-6'>
          <p>
          Pacifica is a cutting-edge human resources consulting firm that leverages the power of data,
          analytics, and AI to provide actionable insights to its clients across various HR functions.
          By harnessing advanced technologies, Pacifica offers innovative solutions in HR, recruiting,
          payroll, retention, DEI and other strategic areas. Through the strategic application of
          data-driven methodologies, Pacifica assists organizations in making informed decisions that
          drive efficiency, productivity, and employee satisfaction.
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
        With a focus on utilizing data, analytics, and AI, Pacifica stands out as a forward-thinking
        partner for businesses seeking to optimize their HR processes. By delving deep into the data
        landscape, Pacifica uncovers valuable insights that enable clients to enhance their recruitment
        strategies, streamline payroll operations, and boost employee retention rates. Through a combination
        of cutting-edge technology and expert human resources knowledge, Pacifica empowers organizations to
        navigate the complexities of the modern workplace with confidence and precision.
        </p>
      </div>
    </div>
  )
}
