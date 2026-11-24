import Link from "next/link";

export default function Work() {
  return (
    <main>
      <ul>
        <li>
          <Link href="/work/ebara" className="underline">Ebara Technologies</Link>
        </li>
        <li>
          CalPERS
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Education Center design system components</li>
            <li>Benefit Verification Enhancements</li>
            <li>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/work/veeva" className="underline">Veeva Systems</Link>
        </li>
      </ul>
    </main>
  );
}