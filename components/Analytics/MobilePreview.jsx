import Image from "next/image";

export const MobilePreview = () => {
  return (
    <div className="md:hidden">
      <Image
        src="/examples/dashboard-light.png"
        width={1280}
        height={866}
        alt="Dashboard"
        className="block dark:hidden"
      />
      <Image
        src="/examples/dashboard-dark.png"
        width={1280}
        height={866}
        alt="Dashboard"
        className="hidden dark:block"
      />
    </div>
  )
}
