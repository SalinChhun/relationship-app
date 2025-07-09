export interface UseInfiniteScrollParams {
    queryKey: string[];
    queryFn: (params: { pageParam: number; search?: string }) => Promise<any>;
    searchValue?: string;
    enabled?: boolean;
}

export interface InfiniteScrollItem {
    id: number;
    title: string;
    subtitle?: string;
    value: any;
}

export interface InfiniteScrollProps {
    items: InfiniteScrollItem[];
    selectedItems?: InfiniteScrollItem[];
    onSelect: (item: InfiniteScrollItem) => void;
    onRemove?: (item: InfiniteScrollItem) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    title: string;
    isLoading?: boolean;
    hasNextPage?: boolean;
    fetchNextPage?: () => void;
    isFetchingNextPage?: boolean;
    searchValue: string;
    onSearchChange: (value: string) => void;
    multiple?: boolean;
    error?: string;
}