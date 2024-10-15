import { QRCode } from 'react-qrcode-logo';

const QRCodeGenerator = ({ content }: { content: string }) => {
  return <QRCode value={content} qrStyle="fluid" quietZone={10} size={100} />;
};

export default QRCodeGenerator;
