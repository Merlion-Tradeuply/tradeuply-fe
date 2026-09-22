import Image from "next/image";

export function WalletQrCode({ imageUrl }: { imageUrl: string }) {
  return (
    <Image
      alt="TradeUply USDT receiving wallet QR code"
      className="size-44 rounded-2xl object-contain"
      height={260}
      priority
      src={imageUrl}
      width={260}
    />
  );
}
