"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { generatePaginationPages } from "src/lib/pagination";

interface PaginationProps {
    totalPages: number;
    pageParam?: string;
}

export default function Pagination({
    totalPages,
    pageParam = "page",
}: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage =
        Number(searchParams.get(pageParam)) || 1;

    const createPageUrl = (
        pageNumber: number | string
    ) => {
        const params = new URLSearchParams(
            searchParams
        );

        params.set(
            pageParam,
            pageNumber.toString()
        );

        return `${pathname}?${params.toString()}`;
    };

    const allPages = generatePaginationPages(
        currentPage,
        totalPages
    );

    if (totalPages <= 0) {
        return null;
    }

    return (
        <nav
            style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                justifyContent: "center",
                margin: "32px 0",
                width: "100%",
            }}
            aria-label="Pagination"
        >
            {/* Previous */}
            <Link
                href={
                    currentPage > 1
                        ? createPageUrl(
                            currentPage - 1
                        )
                        : "#"
                }
                aria-disabled={
                    currentPage <= 1
                }
                onClick={(event) => {
                    if (currentPage <= 1) {
                        event.preventDefault();
                    }
                }}
                style={{
                    padding: "4px 6px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    fontWeight: 500,
                    backgroundColor:
                        currentPage <= 1
                            ? "#f3f4f6"
                            : "#ffffff",
                    color:
                        currentPage <= 1
                            ? "#9ca3af"
                            : "#374151",
                    opacity:
                        currentPage <= 1
                            ? 0.5
                            : 1,
                    textDecoration: "none",
                    cursor:
                        currentPage <= 1
                            ? "not-allowed"
                            : "pointer",
                }}
            >
                Previous
            </Link>

            {/* Page numbers */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                }}
            >
                {allPages.map(
                    (page, index) => {
                        const isEllipsis =
                            page === "...";

                        const isCurrent =
                            currentPage === page;

                        if (isEllipsis) {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    style={{
                                        padding:
                                            "8px 12px",
                                        fontSize:
                                            "14px",
                                        color:
                                            "#6b7280",
                                        fontWeight:
                                            500,
                                    }}
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={`page-${page}`}
                                href={createPageUrl(
                                    page
                                )}
                                aria-current={
                                    isCurrent
                                        ? "page"
                                        : undefined
                                }
                                style={{
                                    padding:
                                        "4px 6px",
                                    fontSize:
                                        "14px",
                                    fontWeight:
                                        500,
                                    borderRadius:
                                        "6px",
                                    border:
                                        "1px solid",
                                    borderColor:
                                        isCurrent
                                            ? "#2563eb"
                                            : "#d1d5db",
                                    backgroundColor:
                                        isCurrent
                                            ? "#2563eb"
                                            : "#ffffff",
                                    color:
                                        isCurrent
                                            ? "#ffffff"
                                            : "#374151",
                                    textDecoration:
                                        "none",
                                    cursor:
                                        isCurrent
                                            ? "default"
                                            : "pointer",
                                }}
                            >
                                {page}
                            </Link>
                        );
                    }
                )}
            </div>

            {/* Next */}
            <Link
                href={
                    currentPage < totalPages
                        ? createPageUrl(
                            currentPage + 1
                        )
                        : "#"
                }
                aria-disabled={
                    currentPage >= totalPages
                }
                onClick={(event) => {
                    if (
                        currentPage >=
                        totalPages
                    ) {
                        event.preventDefault();
                    }
                }}
                style={{
                    padding: "4px 6px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    fontWeight: 500,
                    backgroundColor:
                        currentPage >=
                            totalPages
                            ? "#f3f4f6"
                            : "#ffffff",
                    color:
                        currentPage >=
                            totalPages
                            ? "#9ca3af"
                            : "#374151",
                    opacity:
                        currentPage >=
                            totalPages
                            ? 0.5
                            : 1,
                    textDecoration: "none",
                    cursor:
                        currentPage >=
                            totalPages
                            ? "not-allowed"
                            : "pointer",
                }}
            >
                Next
            </Link>
        </nav>
    );
}