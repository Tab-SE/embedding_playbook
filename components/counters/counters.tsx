// Example from https://beta.reactjs.org/learn

import { useState } from 'react';
import Img from '../Img/img';

function MyButton() {
  const [count, setCount] = useState(9801);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="stat-title">Total Likes</div>
            <button onClick={handleClick} className="btn btn-ghost stat-value text-secondary outline-transparent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              {count}
            </button>
            <div className="stat-desc text-secondary">Click Me!</div>
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div className="stat-title">Page Views</div>
          <div className="stat-value text-primary">3M</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <Img
                  src="img/stock/mackenzie_day.png"
                  alt="sample user"
                  height={64}
                  width={64}
                />
              </div>
            </div>
          </div>
          <div className="stat-value">86%</div>
          <div className="stat-title">Tasks done</div>
          <div className="stat-desc text-secondary">31 tasks remaining</div>
        </div>
        
      </div>
    </>
  )
}

export default function MyApp() {
  return <MyButton />
}
