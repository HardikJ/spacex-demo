import { fetchLaunches, } from '@/lib/api';
import { SortField, SortOrder } from '@/types';
import { NextRequest } from 'next/server';

const ITEMS_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || ITEMS_PER_PAGE.toString(), 10);
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') as SortField;
    const order = searchParams.get('order') as SortOrder;
    const offset = searchParams.get('offset') || "0";

    const allLaunches = await fetchLaunches({page, search, sortBy, order, limit, offset});

    // Calculate pagination
    const totalCount = allLaunches.length;
    const launches = allLaunches;
    const hasMore = allLaunches.length === 0 && page !== 1 ? false : true;

    return Response.json({
      launches,
      total: totalCount,
      hasMore,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching launches:', error);
    return Response.json(
      { error: 'Failed to fetch launches' },
      { status: 500 }
    );
  }
}