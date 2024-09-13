import Image from "next/image";
import { Card, CardContent } from "components/ui";

const galleryItems = [
  { id: 1, link: "/superstore", src: "/img/demos/superstore.png", alt: "Gallery image 1" },
  { id: 2, link: "https://embedding-playbook-git-pacificacpq-tab-se.vercel.app", src: "/img/demos/pacifica_cpq.png", alt: "Gallery image 2" },
  { id: 3, link: "https://embedding-playbook-git-cumulus-tab-se.vercel.app", src: "/img/demos/cumulus_wealth.png", alt: "Gallery image 3" },
  { id: 4, link: "https://embedding-playbook-git-makana-tab-se.vercel.app", src: "/img/demos/makana_payer.png", alt: "Gallery image 4" }
]

export const Gallery = (props) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-3">Embedded Analytics Demo Library</h1>
      <p className="mb-9">Select an industry demo to see Tableau in action!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {galleryItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card key={item.id} className="overflow-hidden shadow-2xl h-60">
              <CardContent className="p-0">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={318}
                  height={171}
                  className="w-full object-cover"
                />
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  )
}
