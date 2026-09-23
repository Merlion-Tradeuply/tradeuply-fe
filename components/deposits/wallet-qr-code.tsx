import Image from "next/image";

export function WalletQrCode({ asset, imageUrl }: { asset: string; imageUrl: string }) {
  return (
    <Image
      alt={`TradeUply ${asset} receiving wallet QR code`}
      className="size-44 rounded-2xl object-contain"
      height={260}
      priority
      src={imageUrl}
      width={260}
    />
  );
}
