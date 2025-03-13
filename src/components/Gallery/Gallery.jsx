import Image from "next/image";
import Link from 'next/link'

import { Card, CardContent } from "components/ui";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "components/ui";
import { Badge } from "components/ui"

import { galleryItems } from './galleryItems';

export const Gallery = (props) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-sm">
        <h1 className="text-4xl text-slate-900 dark:text-slate-100 font-bold mb-6">Embedded Analytics Demo Library</h1>
        <p>Hover over each card to see more details.</p>
        <p>Select an application to see Tableau in action!</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {galleryItems.map((item) => (
            <HoverCard key={item.id}>
              <HoverCardTrigger>
                <Link
                  href={item.link}
                >
                  <Card
                    className="overflow-hidden shadow-2xl h-60 transform transition-transform duration-300 hover:scale-110 cursor-pointer"
                  >
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
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-96 shadow-2xl" sideOffset={15}>
                <div className="flex justify-between space-x-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{item.alt}</h4>
                    <p className="text-sm">
                      {item.description}
                    </p>
                    <div className="flex items-center pt-2">
                      <Badge>
                        {item.icon}
                        <span className="text-xs text-muted-foreground ml-1">
                          {item.vertical}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
        ))}
      </div>
    </div>
  )
}
