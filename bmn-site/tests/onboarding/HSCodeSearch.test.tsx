import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import HSCodeSearch from '@/components/onboarding/HSCodeSearch';

afterEach(cleanup);

describe('HSCodeSearch', () => {
  const mockOnSelect = vi.fn();

  it('renders search input', () => {
    render(<HSCodeSearch onSelect={mockOnSelect} />);
    expect(screen.getByPlaceholderText(/Search by product name/i)).toBeDefined();
  });

  it('shows no results initially', () => {
    render(<HSCodeSearch onSelect={mockOnSelect} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('filters results based on query', async () => {
    render(<HSCodeSearch onSelect={mockOnSelect} />);
    const input = screen.getByPlaceholderText(/Search by product name/i);
    
    // Search for Coffee (Chapter 09)
    fireEvent.change(input, { target: { value: 'Coffee' } });
    
    // Should show Chapter 09 and the specific 6-digit codes I added
    expect(screen.getByText(/Chapter 09/i)).toBeDefined();
    expect(screen.getByText(/090121/i)).toBeDefined();
  });

  it('calls onSelect when a result is clicked', () => {
    render(<HSCodeSearch onSelect={mockOnSelect} />);
    const input = screen.getByPlaceholderText(/Search by product name/i);
    
    fireEvent.change(input, { target: { value: 'Coffee' } });
    
    const resultButton = screen.getByText(/Chapter 09/i).closest('button');
    if (resultButton) fireEvent.click(resultButton);
    
    expect(mockOnSelect).toHaveBeenCalledWith(expect.objectContaining({
      code: '09'
    }));
  });

  it('disables items when maxSelected is reached', () => {
    render(<HSCodeSearch 
      onSelect={mockOnSelect} 
      selectedCodes={['01', '02', '03', '04', '05']} 
      maxSelected={5} 
    />);
    const input = screen.getByPlaceholderText(/Search by product name/i);
    
    fireEvent.change(input, { target: { value: 'Coffee' } });
    
    const resultButton = screen.getByText(/Chapter 09/i).closest('button');
    expect(resultButton).toHaveProperty('disabled', true);
  });
});
