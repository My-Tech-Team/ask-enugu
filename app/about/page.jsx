import MagicWrapper from "@/components/MagicWrapper";

export const metadata = {
  title: "About | Ask Enugu",
  description:
    "Ask Enugu is an independent website that helps people find, understand and check government information in Enugu State.",
};

const missionImage = "/mission.jpg";
const visionImage = "/vision.jpg";

const steps = [
  "You ask a question in your own words.",
  "We look for the most relevant official documents and public records.",
  "An AI tool writes a short answer using only those records.",
  "The answer shows its sources, so you can open them and check.",
];

const values = [
  { name: "Evidence", text: "Show where the answer comes from." },
  { name: "Clarity", text: "Explain in everyday language." },
  { name: "Openness", text: "State what the records cannot confirm." },
  { name: "Access", text: "Make information usable for more people." },
];

function PictureBox({ src, alt }) {
  if (!src) {
    return (
      <div className="flex h-56 w-full items-center justify-center rounded-2xl bg-mist sm:h-72">
        <p className="px-6 text-center text-sm font-medium text-deep-green">
          Photo goes here
        </p>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl">
      <img src={src} alt={alt} className="h-56 w-full object-cover sm:h-72" />
    </div>
  );
}

function CardLabel({ children }) {
  return (
    <div className="flex items-center gap-4">
      <span className="hidden h-3 w-3 shrink-0 rounded-full bg-gold lg:block lg:-ml-[39px]" />
      <span className="text-base font-bold uppercase tracking-wide text-brand-green">
        {children}
      </span>
    </div>
  );
}

// Every card had the same wrapper (the thin line + the label), so it now lives here once.
// Give the last card last={true} so no line runs below it.
function SectionCard({ label, last = false, children }) {
  return (
    <div className="relative">
      {!last && (
        <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-brand-green/30 lg:block" />
      )}
      <div className="flex flex-col gap-6 lg:pl-8">
        <CardLabel>{label}</CardLabel>
        {children}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main>
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left: stays in place on large screens */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <div className="flex flex-col gap-5">
                <div className="h-1 w-12 bg-gold" />
                <span className="text-sm font-bold uppercase tracking-wide text-brand-green">
                  About Ask Enugu
                </span>
                <h2 className="text-3xl font-bold leading-tight text-deep-green sm:text-4xl lg:text-5xl">
                  Government information, within reach.
                </h2>
                <p className="text-lg leading-relaxed text-ink">
                  Ask Enugu is a proposed independent platform that helps people
                  in Enugu State find, understand and check government
                  information. Ask a question about a public service, policy or
                  project, and see the evidence behind the answer.
                </p>
              </div>
            </div>

            {/* Right: cards */}
            <div className="flex flex-col gap-14 lg:col-span-8">
              {/* Card 1: Mission */}
              <div className="relative">
                <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-brand-green/30 lg:block" />
                <div className="flex flex-col gap-6 lg:pl-8">
                  <CardLabel>Our mission</CardLabel>
                  <MagicWrapper className="p-6 border border-border/60">
                    <div className="flex flex-col gap-6">
                      <PictureBox
                        src={missionImage}
                        alt="People going about daily life in Enugu State"
                      />
                      <div className="flex flex-col gap-3">
                        <h3 className="text-2xl font-bold text-deep-green">
                          Make government information easier to find, understand
                          and check
                        </h3>
                        <p className="text-base leading-relaxed text-ink">
                          Official documents can be hard to find and hard to
                          read. We bring them together, explain what they say in
                          everyday words, and show you where each answer comes
                          from.
                        </p>
                      </div>
                    </div>
                  </MagicWrapper>
                </div>
              </div>

              <SectionCard label="How answers are checked">
                <MagicWrapper className="p-6 border border-border/60">
                  <ol className="flex flex-col gap-5">
                    {steps.map((step, index) => (
                      <li key={step} className="flex items-start gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <p className="pt-1 text-base leading-relaxed text-ink">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </MagicWrapper>
              </SectionCard>

              {/* Card 3: Vision */}
              <div className="relative">
                <div className="flex flex-col gap-6 lg:pl-8">
                  <CardLabel>Our vision</CardLabel>
                  <MagicWrapper className="p-6 border border-border/60">
                    <div className="flex flex-col gap-6">
                      <PictureBox
                        src={visionImage}
                        alt="A community meeting in Enugu State"
                      />
                      <div className="flex flex-col gap-3">
                        <h3 className="text-2xl font-bold text-deep-green">
                          A more informed relationship between people and
                          government
                        </h3>
                        <p className="text-base leading-relaxed text-ink">
                          We want public information to be easy for every
                          resident to reach, so people can ask a question about
                          their government and check the answer for themselves.
                        </p>
                      </div>
                    </div>
                  </MagicWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
