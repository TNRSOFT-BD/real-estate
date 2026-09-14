import Reveal from '@/components/frontend/glass/reveal';

export default function ProjectsHero() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-6 pb-4 sm:pt-10 lg:px-8 lg:pt-14" aria-labelledby="projects-title">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
                <Reveal delay={80}>
                    <h1
                        id="projects-title"
                        className="text-ink text-4xl leading-[1.04] font-medium tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
                    >
                        Our Projects
                    </h1>
                </Reveal>

                <Reveal delay={140}>
                    <p className="text-ink-soft max-w-xl text-base leading-relaxed sm:text-lg">
                        Discover our latest developments and thoughtfully designed properties.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
