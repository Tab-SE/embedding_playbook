import Image from 'next/image';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Diversity = () => {
  return (
    <TabsContent value="diversity" className="space-y-4">
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Diversity</CardTitle>
          <CardDescription>
          The Diversity Report for Austin unveils key insights into workforce demographics,
          showcasing both gender and ethnic diversity. The gender pie chart illustrates a
          significant gap, while the ethnic bar chart highlights disparities in representation.
          These findings underscore the critical need for targeted diversity initiatives to foster
          inclusivity within the city's workforce.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Workforce compared to the host city</CardTitle>
          <CardDescription>
          The report's chart highlights a disparity: Hispanic and Caucasian workers are underrepresented,
          while Asian and Black employees are overrepresented among city workers compared to the overall
          city demographics. This underscores the need for focused efforts to address diversity imbalances
          within Austin's workforce.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauEmbed
            src='https://us-west-2a.online.tableau.com/t/embedtableau/views/PacificaDiversityandEquityPayrollReport/CityWorkforcevsAustin'
            width={777}
            height={450}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Gender Makeup</CardTitle>
          <CardDescription>
          The pie chart reveals a significant gender gap in the city's workforce: 71.58% male and 28.42% female.
          The city must also include additional gender categories in future surveys to describe employees who do
          not subscribe to either the male or female definition of gender. This calls for immediate action to
          promote gender diversity and inclusion within Austin's employment landscape.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauEmbed
            src='https://us-west-2a.online.tableau.com/t/embedtableau/views/PacificaDiversityandEquityPayrollReport/Gender'
            width={660}
            height={270}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Organizational Impact</CardTitle>
          <CardDescription>
          <p>
          The underrepresentation of ethnic minorities, such as Black and Hispanic individuals, along with
          female employees, in the city workforce can have profound organizational impacts. It not only
          diminishes the diversity of perspectives and experiences but also hampers the city's ability to
          effectively serve its diverse population. These disparities can lead to decreased morale, hindered
          innovation, and ultimately, a lack of trust in the organization's commitment to diversity and inclusion.
          </p>
          <br/>
          <p>
          Pacifica Staffing Services offers a strategic approach to help organizations overcome these challenges
          and achieve their diversity goals. Through our extensive network and expertise in talent acquisition,
          we specialize in sourcing and attracting diverse candidates who bring unique perspectives and experiences
          to the table. By partnering with Pacifica, organizations can tap into a pool of qualified candidates
          from diverse backgrounds, fostering a more inclusive workforce that reflects the community it serves.
          Our tailored staffing solutions ensure that diversity and inclusion are not just aspirational goals but
          integral components of organizational success.
          </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <Image
            src='img/themes/pacifica/pacifica_staffing.png'
            width='500'
            height='500'
            alt='stock pacifica photo'
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
