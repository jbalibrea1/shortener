"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ShortUrlEntry } from "@/interface/shortURLentry";
import api from "@/lib/axios";
import handleCopy from "@/utils/handleCopy";
import { AlertDialogShort } from "./alert-dialog-share";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const formSchema = z.object({
  url: z
    .string()
    .min(3, {
      message: "Invalid URL",
    })
    .regex(
      /^(https?:\/\/)?([\w-]+\.)*[\w-]+\.[a-z]{2,}(\/.*)?$/i,
      "Invalid URL",
    ),
});

export function FormSendURL() {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<Partial<ShortUrlEntry>>({});

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleCopyAndClose = () => {
    if (data.shortCode) {
      handleCopy({
        url: data.shortCode,
        title: "Popup closed and link copied",
        desc: "Link successfully copied to clipboard 🎉",
        toast: (msg, opts) => {
          if (opts?.type === "error") {
            toast.error(msg, { description: opts?.desc });
          } else {
            toast.success(msg, { description: opts?.desc });
          }
        },
      });
    }
    setOpen(false);
  };

  const handleIconClick = () => {
    if (data.shortCode) {
      handleCopy({
        url: data.shortCode,
        toast: (msg, opts) => {
          if (opts?.type === "error") {
            toast.error(msg, { description: opts?.desc });
          } else {
            toast.success(msg, { description: opts?.desc });
          }
        },
      });
    } else {
      toast.error("URL not found");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (!values.url) throw new Error("Invalid URL");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      // Si hay accessToken en la sesión de NextAuth, añádelo
      if (session?.accessToken) {
        headers.Authorization = `Bearer ${session.accessToken}`;
      }
      const res = await api.post("/urls", values, { headers });
      const { data: responseData } = res.data;
      setData({ ...responseData });
      toast.success("Link generated successfully");
      setOpen(true);
      form.reset();
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message || error.message || "Unknown error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Create short URL</TabsTrigger>
          <TabsTrigger value="qr" disabled>
            Customize QR
          </TabsTrigger>
        </TabsList>
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Shorten your URL</CardTitle>
              <CardDescription>
                Generate a unique link to easily share it, including a QR code.
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
                          <FormLabel>Enter the full URL to shorten</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ ...."
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
                            <Loader className="h-7 w-7 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
                          )}
                          <span className={loading ? "opacity-50" : ""}>
                            Generate link
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to generate a unique link</p>
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
