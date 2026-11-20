import Image from "next/image";
import Link from "next/link";
import FlipClock from "./components/FlipClock";
import img1 from "../public/image-1.jpg";
import img2 from "../public/image-2.jpeg";
import img3 from "../public/image-3.jpeg";

export default function Home() {
  return (
    <main>
      <p>about me</p>
      <div className="flex flex-wrap gap-4">
        <Image src={img1} alt="Juan Alvarez" />
        <Image src={img2} alt="" width={img2.width / 6} />
        <Image src={img3} alt="" width={img3.width / 2} />
      </div>

      <ul className="underline">
  <li><Link href="/work/ebara">Ebara Technologies</Link></li>
  <li><Link href="/work/calpers">CalPERS</Link></li>
  <li><Link href="/work/veeva">Veeva Systems</Link></li>
</ul>

      <FlipClock />
    </main>
  );
}