'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { generatePaginationPages } from "src/lib/pagination";

interface PaginationProps {
    totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageUrl = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const allPages = generatePaginationPages(currentPage, totalPages);

    if (totalPages <= 1) return null;

    return (
        <nav className="flex items-center justify-center space-x-2 my-8" aria-label="Pagination">
            <Link 
              href={createPageUrl(currentPage - 1)}
              className={`px-3 py-2 rounded-md border text-sm font-medium transition-colours 
                ${
                    currentPage <= 1
                      ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
                aria-disabled={currentPage <= 1}
            >
                Previous
            </Link>

            <div className="flex items-center space-x-1">
                {allPages.map((page, index) => {
                    const isEllipsis = page === '...';
                    const isCurrent = currentPage === page;

                    if (isEllipsis) {
                        return (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-3 py-2 text-sm text-gray-500 font-medium"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <Link
                          key={`page-${page}`}
                          href={createPageUrl(page)}
                          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                            isCurrent
                              ? 'bg-blue-600 text-white border-blue-600 pointer-events-none'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                          }`}
                          aria-current={isCurrent ? 'page' : undefined}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            <Link
              href={createPageUrl(currentPage + 1)}
              className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
              aria-disabled={currentPage >= totalPages}
            >
              Next
            </Link>
        </nav>
    );
}