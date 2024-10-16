import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { ShortUrlEntry } from '@/interface/shortURLentry';
import { CopyIcon } from '@radix-ui/react-icons';
import ImageFallback from './image-fallback';
import InputWithCopyIcon from './input-copy';
import QRCodeGenerator from './qrcode';

type AlertDialogDemoProps = {
  open: boolean;
  data: Partial<ShortUrlEntry>;
  handleIconClick: () => void;
  setOpen: (open: boolean) => void;
  handleCopyAndClose: () => void;
};

export function AlertDialogShort({
  open,
  data,
  handleIconClick,
  setOpen,
  handleCopyAndClose,
}: AlertDialogDemoProps) {
  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enlace generado exitosamente</AlertDialogTitle>
          <AlertDialogDescription className="flex items-center gap-4 ">
            <ImageFallback
              data={{ logo: data?.logo || undefined, title: data.title || '' }}
            />
            {data.description
              ? `Descripción: ${data.description}`
              : 'Copia el enlace corto y compártelo con tus amigos'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputWithCopyIcon
          value={data.shortURL}
          readOnly
          iconClick={handleIconClick}
        />
        <AlertDialogFooter className="justify-end sm:items-end gap-2 items-center">
          <QRCodeGenerator content={`${DOMAIN}/${data.shortURL}`} />
          <div
            className="flex flex-col sm:flex-row justify-end
 gap-2 w-full"
          >
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cerrar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCopyAndClose}>
              <CopyIcon /> Copiar y cerrar
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
