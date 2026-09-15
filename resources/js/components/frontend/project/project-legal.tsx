import { mediaUrl } from '@/lib/media';
import { type PublicProject } from '@/types/project';
import { FileText } from 'lucide-react';
import ProjectSectionHeading from './project-section-heading';

export default function ProjectLegal({ project }: { project: PublicProject }) {
    const approvalNo = project.legal_approval_no?.trim() || null;
    const documentUrl = project.legal_approval_document ? mediaUrl(project.legal_approval_document) : null;

    if (!approvalNo && !documentUrl) {
        return null;
    }

    return (
        <div>
            <ProjectSectionHeading id="project-legal-title">Legal &amp; Approvals</ProjectSectionHeading>

            <div className="border-line bg-glass/40 flex flex-wrap items-center justify-between gap-6 rounded-2xl border p-6 sm:p-8">
                <div>
                    {approvalNo ? (
                        <p className="text-ink text-lg font-medium">Approval no. {approvalNo}</p>
                    ) : (
                        <p className="text-ink text-lg font-medium">Approval information</p>
                    )}
                    <p className="text-ink-soft mt-1 text-sm">Verified approvals are available on request.</p>
                </div>

                {documentUrl && (
                    <a
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-line text-ink hover:bg-glass-strong inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors"
                    >
                        <FileText className="size-4" />
                        View approval document
                    </a>
                )}
            </div>
        </div>
    );
}
