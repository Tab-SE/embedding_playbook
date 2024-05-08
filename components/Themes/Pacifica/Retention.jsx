import Image from 'next/image';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Retention = () => {
  return (
    <TabsContent value="retention" className="space-y-4">
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Retention</CardTitle>
          <CardDescription>
          The Equity Report for Austin paints a troubling picture of pay inequities, revealing that
          men earn more than women overall. Furthermore, it sheds light on disparities among ethnic groups,
          with Black and Hispanic employees facing lower pay on aggregate compared to their counterparts.
          Additionally, the report uncovers an overrepresentation of Hispanics in low-paying jobs and
          Caucasians in high-paying positions. These findings underscore the urgent need for proactive
          strategies to rectify these disparities and ensure fair compensation practices across all
          demographic categories.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Employees by Years of Service</CardTitle>
          <CardDescription>
          The Equity Report for Austin offers a stark visualization of pay discrepancies by ethnicity and gender.
          It highlights that, on aggregate, men earn more than women, with Black and Hispanic employees facing lower pay.
          Specifically, Black men and Hispanic women experience notable disparities. These findings underscore the
          imperative for targeted interventions to address systemic inequalities and ensure equitable compensation
          practices across all demographic groups.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pl-2">
          <TableauEmbed
            src='https://us-west-2a.online.tableau.com/t/embedtableau/views/PacificaDiversityandEquityPayrollReport/ServiceYears'
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
          <CardTitle>Organizational Impact</CardTitle>
          <CardDescription>
          <p>
          The pay disparities revealed in the Equity Report for Austin can negatively impact retention rates.
          When certain demographic groups consistently receive lower pay, it can lead to feelings of undervaluation
          and demotivation, prompting talented individuals to seek opportunities elsewhere. Addressing these inequities
          is essential for fostering a workplace where all employees feel fairly compensated and valued, ultimately
          contributing to improved retention and organizational stability.
          </p>
          <br/>
          <p>
          Pacifica Consulting specializes in helping organizations achieve their equity goals. Through data-driven
          strategies and expert guidance, we assist in addressing disparities and fostering an inclusive workplace
          culture. With Pacifica's support, you can navigate equity management effectively, leading to improved
          employee satisfaction and organizational success.
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
