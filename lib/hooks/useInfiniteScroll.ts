import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {InfiniteScrollItem, UseInfiniteScrollParams} from "@/app/types/common";

export const useInfiniteScroll = ({
                                      queryKey,
                                      queryFn,
                                      searchValue = '',
                                      enabled = true,
                                  }: UseInfiniteScrollParams) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
        refetch,
    } = useInfiniteQuery({
        queryKey: [...queryKey, searchValue],
        queryFn: ({ pageParam = 1 }) =>
            queryFn({ pageParam, search: searchValue }),
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.data.pagination;
            // Fixed: Use the correct property names from your API response
            // Your API returns: currentPage, totalPages, hasNext
            // Instead of: current_page, last
            return pagination.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 1,
        enabled,
        staleTime: 0, // Data is always considered stale
        gcTime: 0, // No garbage collection time - data is immediately removed from cache
    });

    const flattenedData = useMemo(() => {
        if (!data?.pages) return [];

        return data.pages.flatMap((page, pageIndex) => {
            // Handle APIs data
            if (page.data.items) {
                return page.data.items.map((feeds: any, index: number): InfiniteScrollItem => ({
                    id: feeds.id,
                    title: feeds.type,
                    subtitle: feeds.createdAt,
                    value: {
                        ...feeds,
                        _uniqueKey: `${feeds.id}`, // Ensure this is unique AND stable
                    },
                }));
            }

            return [];
        });
    }, [data?.pages]);

    const totalElements = data?.pages?.[0]?.data?.pagination?.totalItems || 0;

    return {
        items: flattenedData,
        fetchNextPage,
        hasNextPage: hasNextPage || false,
        isFetchingNextPage,
        isLoading,
        error: error as Error | null,
        totalElements,
        refetch,
    };
};