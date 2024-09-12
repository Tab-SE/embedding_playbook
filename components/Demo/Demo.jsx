import { NavigationMd, Navigation } from "components";

const crumbs = {
  'Dashboard': { 'Orders': '' }
}

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information."

export const Demo = (props) => {
  const { children } = props;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavigationMd />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Navigation crumbs={crumbs} />
        {children}
      </div>
    </div>
  )
}
