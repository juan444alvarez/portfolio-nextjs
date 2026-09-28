import Image from "next/image";
import Link from "next/link";
import { ShowcaseShell } from "@/components/Shell";
import { ExternalLink, ReturnArrow } from "@/components/icons";
import { backButton, link, type } from "@/components/tokens";

/* The fullest showcase: back link, title, an external link, a hero image and
   one section. calpers/ and veeva/ are the same shape without the extras.
   To add a section, copy the <section> block at the bottom. */

export const metadata = { title: "Ebara Technologies" };

export default function Page() {
  return (
    <ShowcaseShell>
      <Link href="/" aria-label="Home" className={backButton}>
        <ReturnArrow className="mr-0.5 h-5 w-5" />
      </Link>

      <h1 className={`mt-4 ${type.showcaseName}`}>
        Untangling information architecture through end-to-end UX research
      </h1>
        <p className={`mt-3 ${type.body}`}>
          Diving into the site&apos;s information architecture surfaced that
          navigation was page-dependent (going one level deeper meant a full
          page load) so the search for a product was a series of waits.
        </p>

      <p className={`mt-3 ${type.body}`}>
        View my &apos;Products&apos; navbar flow at{" "}
        <a
          href="https://ebaratech.com"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          {/* nowrap keeps the icon tied to the domain, so it never wraps alone.
              sr-only rather than aria-label: aria-label replaces text instead of adding to it. */}
          <span className="inline-flex items-center whitespace-nowrap">
            ebaratech.com
            <span className="sr-only"> (opens in a new tab)</span>
            <ExternalLink className="ml-1 h-4 w-4" />
          </span>
        </a>
      </p>

      {/* Fixed aspect + object-cover so a differently-proportioned file crops
          instead of pushing the text around. priority: this is the
          largest-contentful-paint element for anyone landing here directly. */}
      <div className="border-overlay relative mt-4 aspect-2/1 w-full overflow-hidden rounded-sm bg-neutral-200">
        <Image
          src="/ebara-preview.png"
          alt="The redesigned Ebara product navigation, with the mega menu open across category, family and model"
          fill
          sizes="480px"
          className="object-cover"
          priority
        />
      </div>
    </ShowcaseShell>
  );
}
