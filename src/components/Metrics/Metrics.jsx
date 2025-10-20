"use client";

import { useContext } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "components/ui";

import { useMetrics } from 'hooks';
import { Metric } from "components";
import { sortPayloadByIds } from './utils';

export const Metrics = (props) => {
  const { basis, sortOrder } = props;
  // syncs with user metrics, only fires query when user is defined -> controlled query
  const { status, data, error, isError, isSuccess } = useMetrics();

  let metrics;

  if (isSuccess && data) {
    // extract metrics if data is available
    metrics = sortPayloadByIds(data, sortOrder);
  }

  return (
    <div className="h-[132px] px-12 flex justify-center items-center">
      {Array.isArray(metrics) ?
        <Carousel className='flex-grow max-w-full'>
          <CarouselContent className='pt-6 pb-9 px-3'>
            {Array.isArray(metrics) ? metrics.map((metric) => (
              <CarouselItem
                key={metric.id}
                className={basis}
              >
                <Metric
                  key={metric.id}
                  metric={metric}
                />
              </CarouselItem>
            )) : null}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      : null }
    </div>
  )
}
