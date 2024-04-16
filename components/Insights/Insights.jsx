import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from 'components/ui';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui";

import { useInsights } from 'hooks';
import { parseDetail } from 'utils';
import { VegaLiteViz } from 'components';

export const Insights = (props) => {
  const { metric, stats } = props;
  let details;

  // tanstack query hook
  const { status, data, error, isError, isSuccess } = useInsights(metric);

  if (isError) {
    console.debug(error);
  }
  if (isSuccess) {
    // main data found in insight groups
    details = parseDetail(data);
  }

  return (
    <div>
      <Carousel className="max-w-5xl mx-16">
        <CarouselContent>
          {!details ? null : details.map((insight, index) => {
            return (
              <CarouselItem key={insight.id}>
                <Insight insight={insight} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

const Insight = (props) => {
  const { insight } = props;
  const { id, type, markup, viz, fact, characterization, question, score } = insight;

  // Function to format score as percentage
  const formattedScore = `${(score * 100).toFixed(1)}`;

  return type !== 'ban' ? (
    <Card>
      <CardHeader>
        <CardTitle>{question}</CardTitle>
        <CardDescription style={{ fontSize: '10px', color: '#999' }}>Score: {formattedScore}</CardDescription>
      </CardHeader>
      <CardContent>
        {Object.entries(viz).length === 0 ? <></> : <VegaLiteViz height={204} width={900} spec={viz}></VegaLiteViz>}
      </CardContent>
      <CardFooter>
        <p>{markup}</p>
      </CardFooter>
    </Card>
  ) : null;
}


