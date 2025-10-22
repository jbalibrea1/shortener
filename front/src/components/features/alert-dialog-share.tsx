import { CopyIcon } from '@radix-ui/react-icons';
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
import InputWithCopyIcon from './input-copy';
import QRCodeGenerator from './qrcode';
import ImageFallback from '../common/image-fallback';

type AlertDialogDemoProps = {
  open: boolean;
  data: Partial<ShortUrlEntry>;
  handleIconClick: () => void;
  setOpen: (open: boolean) => void;
  handleCopyAndClose: () => void;
};

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export function AlertDialogShort({
  open,
  data,
  handleIconClick,
  setOpen,
  handleCopyAndClose,
}: AlertDialogDemoProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Link generated successfully</AlertDialogTitle>
          <AlertDialogDescription className="flex items-center gap-4 ">
            <ImageFallback
              data={{ logo: data?.logo || undefined, title: data.title || '' }}
            />
            {data.description
              ? `Description: ${data.description}`
              : 'Copy the short link and share it with your friends'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputWithCopyIcon
          value={`${DOMAIN}/${data.shortCode}`}
          readOnly
          iconClick={handleIconClick}
        />
        <AlertDialogFooter className="justify-end sm:items-end gap-2 items-center">
          <QRCodeGenerator content={`${DOMAIN}/${data.shortCode}`} />
          <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Close
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCopyAndClose}>
              <CopyIcon /> Copy and close
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
