import '@testing-library/jest-dom';

import { fireEvent, render } from '@testing-library/react';
import { LayoutGrid, List, Rows } from 'lucide-react';

import ToggleView from '@/components/filters/ToggleView';

jest.mock('@/components/ui/toggle-group', () => {
  let valueChangeHandler: (value: string) => void;

  return {
    ToggleGroup: ({
      children,
      onValueChange,
      defaultValue
    }: {
      children: React.ReactNode;
      onValueChange: (value: string) => void;
      defaultValue: string;
    }) => {
      valueChangeHandler = onValueChange;

      return (
        <div data-testid="toggle-group" data-default-value={defaultValue}>
          {children}
        </div>
      );
    },
    ToggleGroupItem: ({
      children,
      value,
      title
    }: {
      children: React.ReactNode;
      value: string;
      title: string;
    }) => (
      <button
        data-testid={`toggle-item-${value}`}
        data-value={value}
        data-title={title}
        onClick={() => {
          if (valueChangeHandler) {
            valueChangeHandler(value);
          }
        }}
      >
        {children}
      </button>
    ),
  };
});

describe('ToggleView', () => {
  const mockOptions = [
    { value: 'grid', label: 'Grid', icon: <LayoutGrid data-testid="grid-icon" /> },
    { value: 'list', label: 'List', icon: <List data-testid="list-icon" /> },
    { value: 'detail', label: 'Detail', icon: <Rows data-testid="detail-icon" /> },
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toggle options', () => {
    const { getByTestId } = render(
      <ToggleView
        defaultValue="grid"
        onSelect={mockOnSelect}
        options={mockOptions}
      />
    );

    expect(getByTestId('toggle-item-grid')).toBeInTheDocument();
    expect(getByTestId('toggle-item-list')).toBeInTheDocument();
    expect(getByTestId('toggle-item-detail')).toBeInTheDocument();

    expect(getByTestId('grid-icon')).toBeInTheDocument();
    expect(getByTestId('list-icon')).toBeInTheDocument();
    expect(getByTestId('detail-icon')).toBeInTheDocument();
  });

  it('passes correct default value to ToggleGroup', () => {
    const { getByTestId } = render(
      <ToggleView
        defaultValue="list"
        onSelect={mockOnSelect}
        options={mockOptions}
      />
    );

    const toggleGroup = getByTestId('toggle-group');
    expect(toggleGroup).toHaveAttribute('data-default-value', 'list');
  });

  it('calls onSelect when a toggle item is clicked', () => {
    const { getByTestId } = render(
      <ToggleView
        defaultValue="grid"
        onSelect={mockOnSelect}
        options={mockOptions}
      />
    );

    fireEvent.click(getByTestId('toggle-item-list'));

    expect(mockOnSelect).toHaveBeenCalledWith('list');
  });

  it('applies correct accessibility attributes to toggle items', () => {
    const { getByTestId } = render(
      <ToggleView
        defaultValue="grid"
        onSelect={mockOnSelect}
        options={mockOptions}
      />
    );

    const gridToggle = getByTestId('toggle-item-grid');
    expect(gridToggle).toHaveAttribute('data-title', 'Grid view');
  });
}); 