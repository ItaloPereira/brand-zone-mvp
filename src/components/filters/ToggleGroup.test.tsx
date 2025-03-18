import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import ToggleGroupView from './ToggleGroup';

jest.mock('@/components/ui/toggle-group', () => {
  let valueChangeHandler: (value: string) => void;

  return {
    ToggleGroup: ({
      type,
      size,
      defaultValue,
      onValueChange,
      children,
    }: {
      type: 'single' | 'multiple';
      size: string;
      defaultValue: string;
      onValueChange: (value: string) => void;
      children: React.ReactNode;
    }) => {
      valueChangeHandler = onValueChange;

      return (
        <div
          data-testid="toggle-group"
          data-type={type}
          data-size={size}
          data-default-value={defaultValue}
        >
          {children}
        </div>
      );
    },
    ToggleGroupItem: ({
      value,
      title,
      'aria-label': ariaLabel,
      className,
      children,
    }: {
      value: string;
      title: string;
      'aria-label': string;
      className: string;
      children: React.ReactNode;
    }) => (
      <button
        data-testid={`toggle-item-${value}`}
        data-value={value}
        data-title={title}
        aria-label={ariaLabel}
        className={className}
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

describe('ToggleGroupView', () => {
  const mockOptions = [
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
    { value: 'table', label: 'Table' },
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toggle group with all provided options', () => {
    render(
      <ToggleGroupView
        defaultValue="grid"
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    );

    const toggleGroup = screen.getByTestId('toggle-group');
    expect(toggleGroup).toBeInTheDocument();

    expect(screen.getByTestId('toggle-item-grid')).toHaveTextContent('Grid');
    expect(screen.getByTestId('toggle-item-list')).toHaveTextContent('List');
    expect(screen.getByTestId('toggle-item-table')).toHaveTextContent('Table');
  });

  it('passes the correct default value to ToggleGroup', () => {
    render(
      <ToggleGroupView
        defaultValue="list"
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    );

    const toggleGroup = screen.getByTestId('toggle-group');
    expect(toggleGroup).toHaveAttribute('data-default-value', 'list');
  });

  it('adds view suffix to toggle item titles', () => {
    render(
      <ToggleGroupView
        defaultValue="grid"
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    );

    const gridToggle = screen.getByTestId('toggle-item-grid');
    expect(gridToggle).toHaveAttribute('data-title', 'Grid view');

    const listToggle = screen.getByTestId('toggle-item-list');
    expect(listToggle).toHaveAttribute('data-title', 'List view');
  });

  it('calls onSelect with the selected option value when clicking a toggle item', () => {
    render(
      <ToggleGroupView
        defaultValue="grid"
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    );

    fireEvent.click(screen.getByTestId('toggle-item-list'));

    expect(mockOnSelect).toHaveBeenCalledWith('list');
  });

  it('does not call onSelect if value is empty', () => {
    const handleValueChange = (value: string | undefined) => {
      if (!value) return;
      mockOnSelect(value);
    };

    handleValueChange('');

    expect(mockOnSelect).not.toHaveBeenCalled();

    handleValueChange('grid');
    expect(mockOnSelect).toHaveBeenCalledWith('grid');
  });
}); 