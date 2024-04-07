import Image from "next/image";

export const MobilePreview = () => {
  return (
    <div className="md:hidden">
      <Image
        src="img/mobile_previews/hero_superstore.png"
        width={1280}
        height={866}
        alt="Dashboard"
        className="block dark:hidden"
      />
      <Image
        src="img/mobile_previews/hero_superstore_dark.png"
        width={1280}
        height={866}
        alt="Dashboard"
        className="hidden dark:block"
      />
    </div>
  )
}
