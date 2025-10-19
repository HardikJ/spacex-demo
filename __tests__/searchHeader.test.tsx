import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchHeader } from '@/components/SearchHeader';

jest.useFakeTimers();

describe('SearchHeader Component', () => {
  const mockOnFilterChange = jest.fn();
  const initialFilters = {
    search: '',
    sortBy: 'flight_number',
    order: 'asc',
  };

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('should update search input and call onFilterChange after debounce', () => {
    render(<SearchHeader filters={initialFilters} onFilterChange={mockOnFilterChange} totalCount={10} />);

    const input = screen.getByPlaceholderText('Search missions names');
    fireEvent.change(input, { target: { value: 'Falcon' } });

    // Immediate input state updates
    expect((input as HTMLInputElement).value).toBe('Falcon');
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Debounce delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...initialFilters,
      search: 'Falcon',
    });
  });

  it('should clear search when clear button is clicked', () => {
    const filtersWithSearch = { ...initialFilters, search: 'Falcon' };
    render(<SearchHeader filters={filtersWithSearch} onFilterChange={mockOnFilterChange} totalCount={10} />);

    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...filtersWithSearch,
      search: '',
    });
  });

  it('should call onFilterChange with correct sort values', () => {
    render(<SearchHeader filters={initialFilters} onFilterChange={mockOnFilterChange} totalCount={10} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'mission_name-desc' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...initialFilters,
      sortBy: 'mission_name',
      order: 'desc',
    });
  });
});
