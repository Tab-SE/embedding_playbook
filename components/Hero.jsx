import { DisplayContextProvider } from 'components/context';
import { Demo } from 'components';

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

const Outro = (props) => {
  const { snippet } = props;
  return (
    <div className='overflow-hidden'>
      { snippet }
    </div>
  )
}
