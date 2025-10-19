import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

jest.useFakeTimers(); // Enable fake timers

describe('useDebounce Hook', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('Hello', 500));
    expect(result.current).toBe('Hello');
  });

  it('should update the debounced value after delay', () => {
    let value = 'Hello';
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value },
    });

    // Change value
    value = 'World';
    rerender({ value });

    // Before delay
    expect(result.current).toBe('Hello');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('World');
  });

  it('should cancel timeout if value changes quickly', () => {
    let value = 'A';
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value },
    });

    // Change value multiple times before delay
    value = 'B';
    rerender({ value });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    value = 'C';
    rerender({ value });

    // Debounced value should still be 'A'
    expect(result.current).toBe('A');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now debounced value should update to final value
    expect(result.current).toBe('C');
  });
});
