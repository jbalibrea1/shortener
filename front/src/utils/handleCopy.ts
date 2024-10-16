interface handleCopyProps {
  url: string;
  desc?: string;
  title?: string;
  toast: ({}) => void;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleCopy = ({ url, desc, title, toast }: handleCopyProps) => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      toast({
        title: title ?? 'Enlace copiado',
        description: desc ?? 'Enlace copiado al portapapeles correctamente  🎉',
      });
    })
    .catch((error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error al copiar el enlace',
        description: 'Por favor, intenta de nuevo.',
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    });
};

export default handleCopy;
