import Detail from './Detail';

export default function Insights(props) {
  const { metric, stats, setBundleCount } = props;

  return (
    <>
      <div className='flex items-end p-4'>
        <h1 className='flex-0 font-bold text-4xl text-stone-600'>
          {metric.name}:
        </h1>
        <p className='flex-1 font-bold text-4xl text-stone-800 mx-2'>{stats.value}</p>
      </div>
      <div className='my-8' >
        <Detail 
          metric={metric}
          stats={stats}
          setBundleCount={setBundleCount}
        />
      </div>
    </>
  )
}
