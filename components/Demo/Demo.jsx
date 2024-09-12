import { NavigationMd, Navigation, Customers, Orders, Products } from "components";

const crumbs = {
  'Dashboard': { 'Orders': '' }
}

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information."

export const Demo = (props) => {
  const { } = props;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavigationMd />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Navigation crumbs={crumbs} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <Orders />
        </main>
      </div>
    </div>
  )
}
