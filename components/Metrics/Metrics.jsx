import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "components/ui";

import { useMetrics } from 'hooks';
import { Metric } from "components";


export const Metrics = (props) => {
  const { theme } = props;
  const [user, setUser] = useState(null);
  const { status: session_status, data: session_data } = useSession({});
  // syncs with user metrics, only fires query when user is defined -> controlled query
  const { status, data, error, isError, isSuccess } = useMetrics(user);

  // updates user for authenticated components
  useEffect(() => {
    if (session_status === 'authenticated') {
      setUser(session_data.user.name); // value used for controlled queries
    }
  }, [session_status, session_data]);

  if (isError) {
    console.debug(error);
  }

  return (
    <div className="min-h-[111px] px-16">
      {Array.isArray(data) ?
        <Carousel>
          <CarouselContent>
            {Array.isArray(data) ? data.map((metric) => (
              <CarouselItem
                key={metric.id}
                className="basis-1/3"
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
