import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from 'components/ui';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";


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
      <Carousel className="max-w-6xl mx-16 shadow-2xl">
        <CarouselContent>
          {!details ? null : details.map((insight, index) => {
            return (
              <CarouselItem key={insight.id}>
                <Insight insight={insight} stats={stats} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
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
        {Object.entries(viz).length === 0 ? <></> : <VegaLiteViz height={260} width={560} spec={viz}></VegaLiteViz>} {/* Dashboard extensions can only be so tall... need to reduce height to 260 */}
      </CardContent>
      <CardFooter>
       {markup.includes("<span") ? <span dangerouslySetInnerHTML={{__html: markup}} />  :{markup}}
      </CardFooter>
    </Card>
  ) : null;
}
