import Image from "next/image";
import img1 from "../../public/image-1.jpg";
import img2 from "../../public/image-2.jpeg";
import img3 from "../../public/image-3.webp";

export default function About() {
  return (
    <main>
      <p>about me:</p>
      <div className="flex flex-wrap gap-4">
        <Image src={img1} alt="Juan Alvarez" />
        <Image src={img2} alt="" width={img2.width / 1.5} />
        <Image src={img3} alt="" />
      </div>
    </main>
  );
}