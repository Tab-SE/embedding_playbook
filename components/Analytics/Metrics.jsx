import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui";

import { useMetrics } from 'hooks';
import { Metric } from "./Metric";


export const Metrics = (props) => {
  const [user, setUser] = useState(undefined);
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

  // metrics returned successfully 
  if (isSuccess && Array.isArray(data)) {
    if (data.length > 0) {
      return (
        <div className="min-h-[120px] px-16">
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
        </div>
      );
    } else {
      <div className="min-h-[120px]"></div>
    } 
  }

  // placeholder
  return (
    <div className="min-h-[120px]"></div>
  )
}
