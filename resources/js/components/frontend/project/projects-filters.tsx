import { cn } from '@/lib/utils';
import { type ProjectFilterOption, type ProjectStatusFilterOption, type ProjectsIndexFilters } from '@/types/project';
import { router } from '@inertiajs/react';
import { ChevronDown, X } from 'lucide-react';

interface ProjectsFiltersProps {
    types: ProjectFilterOption[];
    statuses: ProjectStatusFilterOption[];
    locations: string[];
    filters: ProjectsIndexFilters;
}

export default function ProjectsFilters({ types, statuses, locations, filters }: ProjectsFiltersProps) {
    const apply = (next: Partial<ProjectsIndexFilters>) => {
        const projectType = next.project_type !== undefined ? next.project_type : filters.project_type;
        const projectStatus = next.project_status !== undefined ? next.project_status : filters.project_status;
        const locationCity = next.location_city !== undefined ? next.location_city : filters.location_city;
        const search = next.search !== undefined ? next.search : filters.search;

        const params: Record<string, string> = {};

        if (projectType) {
            params.project_type = projectType;
        }

        if (projectStatus) {
            params.project_status = projectStatus;
        }

        if (locationCity) {
            params.location_city = locationCity;
        }

        if (search) {
            params.search = search;
        }

        router.get('/projects', params, { preserveScroll: true, preserveState: true, replace: true });
    };

    const isFiltered = Boolean(filters.project_type || filters.project_status || filters.location_city || filters.search);

    if (types.length === 0 && statuses.length === 0 && locations.length === 0) {
        return null;
    }

    const typeOptions: ProjectFilterOption[] = [{ slug: '', name: 'All Projects' }, ...types];

    const selectClass =
        'border-line text-ink-soft hover:border-ink/35 focus-visible:border-ink h-10 w-full appearance-none border bg-transparent pr-9 pl-3.5 text-sm transition-colors focus-visible:outline-none';

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-10 lg:px-8" aria-label="Project filters">
            <div className="border-line bg-canvas/80 sticky top-[4.5rem] z-30 border-y backdrop-blur-xl lg:top-16">
                <div className="flex flex-col gap-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                    <div className="-mb-px flex items-center gap-7 overflow-x-auto" role="tablist" aria-label="Project type">
                        {typeOptions.map((type) => {
                            const active = (filters.project_type ?? '') === type.slug;

                            return (
                                <button
                                    key={type.slug || 'all'}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => apply({ project_type: type.slug || null })}
                                    className={cn(
                                        'relative shrink-0 pb-2.5 text-sm whitespace-nowrap transition-colors',
                                        active ? 'text-ink font-medium' : 'text-ink-soft hover:text-ink',
                                    )}
                                >
                                    {type.name}
                                    <span
                                        aria-hidden
                                        className={cn('bg-ink absolute inset-x-0 bottom-0 h-0.5 transition-opacity', active ? 'opacity-100' : 'opacity-0')}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {locations.length > 0 && (
                            <div className="relative shrink-0">
                                <select
                                    value={filters.location_city ?? ''}
                                    onChange={(event) => apply({ location_city: event.target.value || null })}
                                    aria-label="Filter by location"
                                    className={cn(selectClass, 'sm:w-48')}
                                >
                                    <option value="">All Locations</option>
                                    {locations.map((location) => (
                                        <option key={location} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="text-ink-soft pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" aria-hidden />
                            </div>
                        )}

                        {statuses.length > 0 && (
                            <div className="relative shrink-0">
                                <select
                                    value={filters.project_status ?? ''}
                                    onChange={(event) => apply({ project_status: event.target.value || null })}
                                    aria-label="Filter by status"
                                    className={cn(selectClass, 'sm:w-52')}
                                >
                                    <option value="">Any Status</option>
                                    {statuses.map((status) => (
                                        <option key={status.slug} value={status.slug}>
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="text-ink-soft pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" aria-hidden />
                            </div>
                        )}

                        {isFiltered && (
                            <button
                                type="button"
                                onClick={() => apply({ project_type: null, project_status: null, location_city: null, search: null })}
                                className="text-ink-soft hover:text-ink inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium tracking-[0.16em] uppercase transition-colors"
                            >
                                <X className="size-3.5" aria-hidden />
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
