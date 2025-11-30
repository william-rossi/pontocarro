
import { VehicleFilter, SortBy, SortOrder } from '@/services/vehicles';

interface ParsedFilterParams {
    filters: VehicleFilter;
    page: number;
    sortBy: SortBy;
    sortOrder: SortOrder;
}

export function parseSearchParams(
    searchParams: URLSearchParams,
    validSortBy: SortBy[],
    validSortOrder: SortOrder[]
): ParsedFilterParams {
    const filters: VehicleFilter = {};
    let page = 1;
    let sortBy: SortBy = 'createdAt';
    let sortOrder: SortOrder = 'desc';

    searchParams.forEach((value, key) => {
        if (key === 'page') {
            const parsedPage = parseInt(value);
            if (!isNaN(parsedPage) && parsedPage >= 1) {
                page = parsedPage;
            }
        } else if (key === 'sortBy') {
            if (validSortBy.includes(value as SortBy)) {
                sortBy = value as SortBy;
            }
        } else if (key === 'sortOrder') {
            if (validSortOrder.includes(value as SortOrder)) {
                sortOrder = value as SortOrder;
            }
        } else {
            const filterKey = key as keyof VehicleFilter;
            if (['minYear', 'maxYear', 'minPrice', 'maxPrice', 'mileage', 'maxMileage', 'limit'].includes(filterKey)) {
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    (filters[filterKey] as number) = numValue; // Assegura que é number
                }
            } else {
                (filters[filterKey] as string) = value; // Assegura que é string
            }
        }
    });

    return { filters, page, sortBy, sortOrder };
}
