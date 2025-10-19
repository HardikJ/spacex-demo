import { Launch, SortField, SortOrder } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
console.log("BASE URL",BASE_URL)
interface LaunchQueryParams {
  search?: string;
  sortBy?: SortField;
  order?: SortOrder;
  limit?: number;
  page?: number;
  offset?: string;
}

// Build URL query parameters for SpaceX API

function buildQueryParams(params: LaunchQueryParams): string {
  const query = new URLSearchParams();

  if (params.page) query.set('page', params.page.toString());
  if (params.search) query.set('mission_name', params.search); // for mock backend
  if (params.sortBy) query.set('sort', params.sortBy);
  if (params.order) query.set('order', params.order);
  if (params.offset) query.set('offset', params.offset);
  if (params.limit) query.set('limit', params.limit.toString());

  return query.toString();
}

//Fetch launches from SpaceX API
export async function fetchLaunches(params: LaunchQueryParams = {}): Promise<Launch[]> {
  const queryString = buildQueryParams(params);
  const url = queryString ? `${BASE_URL}/launches?${queryString}` : `${BASE_URL}/launches`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) throw new Error(`Failed to fetch launches: ${response.statusText}`);

    const data: Launch[] = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching launches:', error);
    throw error;
  }
}


//Format a date string into 'MMM DD, YYYY'
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}


export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

