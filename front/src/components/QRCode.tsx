import { QRCode } from 'react-qrcode-logo';

const QRCodeGenerator = ({ content }: { content: string }) => {
  return <QRCode value={content} qrStyle="fluid" quietZone={20} />;
};

export default QRCodeGenerator;
