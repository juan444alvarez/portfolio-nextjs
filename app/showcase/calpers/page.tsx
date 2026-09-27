import Link from "next/link";
import { ShowcaseShell } from "@/components/Shell";
import { ReturnArrow } from "@/components/icons";
import { backButton, type } from "@/components/tokens";

/* Same shape as ebara/page.tsx, minus the external link and hero.
   ⚠️ Draft copy from your earlier write-up — check and expand. */

export const metadata = { title: "CalPERS" };

export default function Page() {
  return (
    <ShowcaseShell>
      <Link href="/" aria-label="Home" className={backButton}>
        <ReturnArrow className="mr-0.5 h-5 w-5" />
      </Link>

      <h1 className={`mt-4 ${type.showcaseName}`}>
        Aligning content strategy with the software development lifecycle
      </h1>

      <section className="mt-6" aria-labelledby="role">
        <h2 id="role" className={type.name}>
          Role
        </h2>
        <p className={`mt-3 ${type.body}`}>
          Supported projects across the software development lifecycle,
          working alongside engineering to keep design decisions grounded in
          what could actually ship.
        </p>
      </section>
    </ShowcaseShell>
  );
}
