import Image from 'next/image';

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
      <h1 className='text-5xl font-bold mb-9'>Makana Health Payer Portal</h1>
        <div className='leading-loose space-y-6'>
          <p>Welcome to the Makana Health Insurance Claims Optimization Portal!</p>
          <p>This platform is designed to empower Claims Processing Directors with the insights needed to streamline the claims process and enhance efficiency. By utilizing our advanced visualizations, you can quickly identify trends, uncover areas for improvement, and take proactive steps to reduce denial rates and processing times.</p>

          <Image
        src='/img/makanaHealth/makana_xray.png'
        width='750'
        height='500'
        alt='xray photo'
      />

<p>Here’s what you can explore:</p>
  <li><b>Denial Rate by Processing Time by Hospital</b>: Gain a clear understanding of which hospitals have the highest denial rates and how processing times impact these rates.</li>

  <li><b>Denied Claims by Cause</b>: Identify the most common reasons for denied claims and develop strategies to address these issues.</li>

  <li><b>Denial Rate by Processing Time by Diagnostic</b>: Analyze how different diagnoses affect denial rates and processing times.</li>

  <li><b>Processing Time and Denial Rate by Day</b>: Monitor daily trends in processing times and denial rates to spot patterns and make timely adjustments.</li>

<p>We are committed to helping you optimize your claims processing, reduce costs, and improve patient satisfaction. Dive into the data and discover new ways to enhance your operations today!</p>

        </div>
    </div>
  )
}

const Outro = (props) => {
  const { snippet } = props;
  return (
    <div className='overflow-hidden'>
      {/* { snippet } */}
    </div>
  )
}
