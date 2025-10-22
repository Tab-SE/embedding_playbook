'use client';

import Image from "next/image";
import Link from 'next/link'
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";

import { Card, CardContent } from "@/components/ui";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "components/ui";
import { Badge } from "@/components/ui";

import { galleryItems } from './galleryItems';


export const Gallery = (props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleCardClick = async (item) => {
    await queryClient.invalidateQueries(
      {
        queryKey: ['tableau'],
        refetchType: 'none',
      }
    );

    const callbackUrl = `/demo/${item.id}`;
    const authUrl = `/demo/${item.id}/auth`;
    // sign the user out without redirecting to standard auth page
    signOut({ redirect: false, callbackUrl: callbackUrl });
    router.push(authUrl);
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-sm">
        <h1 className="text-4xl text-slate-900 dark:text-slate-100 font-bold mb-6">Embedded Analytics Demo Library</h1>
        <p>Hover over each card to see more details.</p>
        <p>Select an application to see Tableau in action!</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {galleryItems.map((item) => (
          <HoverCard
            key={item.id}
          >
            <HoverCardTrigger>
              <Card className="overflow-hidden shadow-2xl h-60 transform transition-transform duration-300 hover:scale-110 cursor-pointer" onClick={() => handleCardClick(item)}>
                <CardContent className="p-0 relative">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
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
                      <span className="text-xs text-white ml-1">
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
