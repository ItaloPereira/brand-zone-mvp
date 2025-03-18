import '@testing-library/jest-dom';

import { fireEvent, render } from '@testing-library/react';

import AppliedFilters from './AppliedFilters';

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="badge" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon">×</span>,
}));

describe('AppliedFilters', () => {
  const mockFilters = [
    { type: 'group', id: 'group-1', label: 'Design' },
    { type: 'tag', id: 'tag-1', label: 'Red' },
    { type: 'search', id: 'search-1', label: 'logo' },
  ];

  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when no filters are applied', () => {
    const { container } = render(
      <AppliedFilters appliedFilters={[]} onRemove={mockOnRemove} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders badges for each applied filter', () => {
    const { getAllByTestId, getByText } = render(
      <AppliedFilters appliedFilters={mockFilters} onRemove={mockOnRemove} />
    );

    const badges = getAllByTestId('badge');
    expect(badges).toHaveLength(mockFilters.length);

    expect(getByText('Design')).toBeInTheDocument();
    expect(getByText('Red')).toBeInTheDocument();
    expect(getByText('logo')).toBeInTheDocument();
  });

  it('calls onRemove with correct filter when remove button is clicked', () => {
    const { getAllByTestId } = render(
      <AppliedFilters appliedFilters={mockFilters} onRemove={mockOnRemove} />
    );

    const removeButtons = getAllByTestId('x-icon').map(icon => icon.closest('button'));

    fireEvent.click(removeButtons[0] as HTMLElement);

    expect(mockOnRemove).toHaveBeenCalledWith(mockFilters[0]);

    fireEvent.click(removeButtons[1] as HTMLElement);

    expect(mockOnRemove).toHaveBeenCalledWith(mockFilters[1]);
  });

  it('includes screenreader text for accessibility', () => {
    const { getAllByText } = render(
      <AppliedFilters appliedFilters={mockFilters} onRemove={mockOnRemove} />
    );

    expect(getAllByText('Remove Design filter')).toHaveLength(1);
    expect(getAllByText('Remove Red filter')).toHaveLength(1);
    expect(getAllByText('Remove logo filter')).toHaveLength(1);
  });
}); 