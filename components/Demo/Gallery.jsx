import Image from "next/image";
import { Card, CardContent } from "components/ui";

const galleryItems = [
  { id: 1, link: "/superstore", src: "/placeholder.svg?height=300&width=400", alt: "Gallery image 1" },
  { id: 2, link: "/pacifica", src: "/placeholder.svg?height=300&width=400", alt: "Gallery image 2" },
  { id: 3, link: "/cumulus", src: "/placeholder.svg?height=300&width=400", alt: "Gallery image 3" },
  { id: 4, link: "/makana", src: "/placeholder.svg?height=300&width=400", alt: "Gallery image 4" },
  { id: 5, link: "", src: "/placeholder.svg?height=300&width=400", alt: "Gallery image 5" },
  { id: 6, link: "", src: "/placeholder.svg?height=300&width=400", alt: "Gallery image 6" },
]

export const Gallery = (props) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-12">Embedded Analytics Demo Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <Image
                src={item.src}
                alt={item.alt}
                width={400}
                height={300}
                className="w-full h-auto object-cover"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
