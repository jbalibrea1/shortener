interface handleCopyProps {
  url: string;
  desc?: string;
  title?: string;
  toast: (
    msg: string,
    opts?: { type?: 'success' | 'error'; desc?: string }
  ) => void;
}

const handleCopy = ({ url, desc, title, toast }: handleCopyProps) => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      toast(title ?? 'Enlace copiado', {
        type: 'success',
        desc: desc ?? 'Enlace copiado al portapapeles correctamente  🎉'
      });
    })
    .catch((error) => {
      console.error(error);
      toast('Error al copiar el enlace', {
        type: 'error',
        desc: 'Por favor, intenta de nuevo.'
      });
    });
};

export default handleCopy;
