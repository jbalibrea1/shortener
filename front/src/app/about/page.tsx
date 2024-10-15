import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const page = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8 pt-12">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Questions and Answers
      </h1>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            ¿Qué es este proyecto de acortador de URLs?
          </AccordionTrigger>
          <AccordionContent>
            Este proyecto es un servicio que permite a los usuarios crear URLs
            cortas y fáciles de compartir. Detrás de cada URL acortada, se
            almacena la URL original junto con información adicional como
            metadatos y un contador de clics para analizar su rendimiento.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            ¿Cómo funciona el acortador de URLs?
          </AccordionTrigger>
          <AccordionContent>
            Los usuarios ingresan una URL en el sistema, y este genera una
            versión corta y única que redirige a la URL original.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>¿Los QR generados caducan?</AccordionTrigger>
          <AccordionContent>
            NO!, los códigos QR generados por el acortador de URLs no caducan.
            Cada QR está vinculado de forma permanente a la URL corta, lo que
            significa que se puede utilizar indefinidamente siempre que la URL
            acortada siga siendo válida en el sistema.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>¿El proyecto está terminado?</AccordionTrigger>
          <AccordionContent>
            No, el proyecto está en fase beta. Aunque es completamente
            utilizable para acortar URLs y generar códigos QR, aún faltan
            funcionalidades clave como el registro de usuarios, la autenticación
            y herramientas avanzadas de análisis. Estas características están en
            desarrollo y se añadirán en futuras versiones.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default page;
