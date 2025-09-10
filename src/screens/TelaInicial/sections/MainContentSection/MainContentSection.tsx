import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export const MainContentSection = (): JSX.Element => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const cardData = [
    {
      id: 1,
      title: "Inovações em Saúde",
      imageSrc: "https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg",
      description:
        "Descubra as últimas tecnologias e avanços na medicina moderna que estão revolucionando o atendimento ao paciente.",
    },
    {
      id: 2,
      title: "Prevenção e Bem-estar",
      imageSrc: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg",
      description:
        "Guia completo sobre práticas preventivas e hábitos saudáveis para manter seu corpo e mente em equilíbrio.",
    },
    {
      id: 3,
      title: "Especialidades Médicas",
      imageSrc: "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg",
      description:
        "Conheça nossa equipe de especialistas e as diferentes áreas de atuação para um cuidado completo.",
    },
    {
      id: 4,
      title: "Saúde Mental",
      imageSrc: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
      description:
        "A importância do equilíbrio emocional e como nossos profissionais podem ajudar no seu bem-estar mental.",
    },
    {
      id: 5,
      title: "Nutrição e Saúde",
      imageSrc: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
      description:
        "Dicas e orientações nutricionais personalizadas para uma vida mais saudável e equilibrada.",
    },
  ];

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Conteúdo em Destaque</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="rounded-full"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="rounded-full"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {cardData.map((card) => (
            <div key={card.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4 first:pl-0">
              <Card className="h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <img
                  className="w-full h-[200px] object-cover rounded-t-xl"
                  alt={`Imagem de ${card.title}`}
                  src={card.imageSrc}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};