'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { ShortUrlEntry } from '@/interface/shortURLentry';
import handleCopy from '@/utils/handleCopy';
import {} from '@radix-ui/react-tooltip';
import { useState } from 'react';
import { AlertDialogShort } from './alert-dialog-share';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
const formSchema = z.object({
  url: z.string().min(4, {
    message: 'URL no válida',
  }),
  // .url({
  //   message: 'URL no válida',
  // }),
});

export function FormSendURL() {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<Partial<ShortUrlEntry>>({});

  const { toast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const handleCopyAndClose = () => {
    if (data.shortURL) {
      handleCopy(data.shortURL, toast);
    }
    setOpen(false);
  };

  const handleIconClick = () => {
    if (data.shortURL) {
      handleCopy(data.shortURL, toast);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'URL no encontrada',
      });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (!values.url) throw new Error('URL no válida');
      const res = await fetch(`${API_URL}/shorturl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al acortar la URL');
      setData({ ...data, shortURL: `${DOMAIN}/${data.shortURL}` });
      toast({
        title: 'Enlace generado exitosamente',
        description: `${new Date().toLocaleDateString(
          'es-ES'
        )} - ${new Date().toLocaleTimeString()}`,
      });
      setOpen(true);
      form.reset();
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      console.log('Error', message);
      toast({
        variant: 'destructive',
        title: 'Error al generar el enlace',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Crear URL acortada</TabsTrigger>
          <TabsTrigger value="qr" disabled>
            Personalizar QR
          </TabsTrigger>
        </TabsList>
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Acorta tu URL</CardTitle>
              <CardDescription>
                Genera un enlace único para compartirlo fácilmente y con código
                QR.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                method="POST"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <CardContent className="px-6 py-0">
                  <div className="grid w-full items-center gap-4">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escribe la url a acortar</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                              disabled={loading}
                              className="text-base sm:text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <TooltipProvider delayDuration={500} skipDelayDuration={500}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="relative"
                        >
                          {loading && (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin absolute top-50 left-50 ml-3" />
                          )}
                          Generar enlace
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clic para generar un enlace único</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="qr">{/* SECOND TAB */}</TabsContent>
      </Tabs>
      <AlertDialogShort
        open={open}
        data={data}
        handleIconClick={handleIconClick}
        setOpen={setOpen}
        handleCopyAndClose={handleCopyAndClose}
      />
    </>
  );
}
