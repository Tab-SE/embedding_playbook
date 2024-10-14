import Image from 'next/image';

import { DisplayContextProvider } from 'components/context';
import { HeroDemo } from 'components';

const Intro = () => {
  return (
    <div>
      <h1 className='text-5xl font-bold mb-9'>Simplify VMS</h1>
        <div className='leading-loose space-y-9'>
          <p>In a world that is changing rapidly and unpredictably, businesses need advanced technology solutions to manage their contingent workforce with ease and efficiency.</p>
          <b/>
          <p>Simplify’s Direct Sourcing technology solution enables contingent worker sourcing, engagement and management without staffing suppliers.</p>
          <Image
            src='/img/tableau/stock/showcase.png'
            width='750'
            height='500'
            alt='stock photo'
          />
        <p><strong>Source Without Staffing Suppliers</strong>
        <ul style={{listStyleType: 'disc', marginLeft: '20px'}}>
            <li>Avoid costly agency mark-ups while taking control of candidate experience and vetting</li>
            <li>Slash recruitment spend by 10% and vacancy aging rates by half</li>
            <li>Get full visibility across the entire req-to-check process and optimize on your own terms</li>
            <li>Design your own social recruitment marketing campaigns and engagement strategies</li>
        </ul>
        </p>
        </div>
    </div>
  )
}

const Outro = () => {
  return (
    <div className='overflow-hidden leading-loose space-y-9'>
      <Image
        src='/img/tableau/stock/embed_samples.png'
        width='750'
        height='500'
        alt='stock photo'
      />
       <p><strong>Re-engage Your Best Talent</strong>
        <ul style={{listStyleType: 'disc', marginLeft: '20px'}}>
            <li>Don’t allow your best contingent talent to disappear after they worked for you – develop a relationship</li>
            <li>Maintain your own curated private talent pools of preferred contingent workers to re-engage and redeploy to new assignments</li>
            <li>Leverage chatbot capabilities to continuously engage and communicate with talent members</li>
            <li>Build your brand and a talent community that grows by word of mouth</li>
        </ul>
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
        <HeroDemo
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
