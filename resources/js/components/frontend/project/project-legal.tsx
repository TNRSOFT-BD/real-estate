import Reveal from '@/components/frontend/glass/reveal';
import SectionLabel from '@/components/frontend/glass/section-label';
import { mediaUrl } from '@/lib/media';
import { type PublicProject } from '@/types/project';
import { FileText } from 'lucide-react';

export default function ProjectLegal({ project }: { project: PublicProject }) {
    if (!project.legal_approval_no && !project.legal_approval_document) {
        return null;
    }

    const documentUrl = project.legal_approval_document ? mediaUrl(project.legal_approval_document) : null;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:pb-20 lg:px-8 lg:pb-24" aria-labelledby="project-legal-title">
            <div className="border-line border-t pt-10">
                <Reveal>
                    <SectionLabel>Legal &amp; approvals</SectionLabel>
                </Reveal>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <h2 id="project-legal-title" className="text-ink text-2xl font-medium tracking-[-0.01em] sm:text-3xl">
                            Approval information
                        </h2>
                        {project.legal_approval_no && <p className="text-ink-soft mt-3 text-sm">Approval no. {project.legal_approval_no}</p>}
                    </div>

                    {documentUrl && (
                        <a
                            href={documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-line text-ink hover:bg-glass inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors"
                        >
                            <FileText className="size-4" />
                            View approval document
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
