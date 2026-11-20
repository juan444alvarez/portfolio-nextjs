import Image from "next/image";
import Link from "next/link";
import FlipClock from "./components/FlipClock";
import img1 from "../public/image-1.jpg";
import img2 from "../public/image-2.jpeg";

export default function Home() {
  return (
    <main>
      <p>about me</p>
      <div className="flex flex-wrap gap-4">
        <Image src={img1} alt="Juan Alvarez" />
        <Image src={img2} alt="" width={img2.width / 6} />
      </div>

      <ul>
  <li>
    <Link href="/work/ebara" className="underline">Ebara Technologies</Link>
  </li>
  <li>
    CalPERS
    <ul className="mt-2 list-disc space-y-1 pl-5">
      <li>
        Education Center design system components
      </li>
      <li>
        <li>
        Benefit Verification Enhancements
      </li>
  <Link href="/work/calpers/internal-tool" className="underline">
    Rapid-prototyped internal tool using AI - Deloitte business chemistry framework
  </Link>
</li>
    </ul>
  </li>
  <li>
    <Link href="/work/veeva" className="underline">Veeva Systems</Link>
  </li>
</ul>

      <FlipClock />
    </main>
  );
}