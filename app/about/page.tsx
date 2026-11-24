import Image from "next/image";
import img1 from "../../public/image-1.jpeg";

export default function About() {
  return (
    <main>
      <p>about me: 28yr old interested in design, code, music, and psychology</p>
      <div className="flex flex-wrap gap-4">
        <Image src={img1} alt="" width={img1.width / 6} />
      </div>
    </main>
  );
}