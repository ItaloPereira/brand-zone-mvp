import '@testing-library/jest-dom';

import type { Group } from '@prisma/client';
import { fireEvent, render, screen } from '@testing-library/react';

import { GroupSelector, type GroupValue } from './GroupSelector';

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div data-testid="popover">{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-trigger">{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-content">{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, onClick, className }: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
  }) => {
    const isMainButton = className?.includes('w-full justify-between');

    return (
      <button
        data-testid={isMainButton ? "main-button" : "add-button"}
        disabled={disabled}
        onClick={onClick}
        className={className}
      >
        {children}
      </button>
    );
  },
}));

jest.mock('@/components/ui/command', () => {
  let valueChangeHandler: (value: string) => void;

  return {
    Command: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="command" className={className}>{children}</div>
    ),
    CommandInput: ({
      placeholder,
      onValueChange,
      value
    }: {
      placeholder: string;
      onValueChange: (value: string) => void;
      value: string;
    }) => {
      // Store the callback
      valueChangeHandler = onValueChange;

      return (
        <input
          data-testid="command-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        />
      );
    },
    CommandList: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="command-list">{children}</div>
    ),
    CommandEmpty: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="command-empty">{children}</div>
    ),
    CommandGroup: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="command-group">{children}</div>
    ),
    CommandItem: ({
      children,
      onSelect
    }: {
      children: React.ReactNode;
      onSelect: () => void;
    }) => (
      <div data-testid="command-item" onClick={onSelect}>{children}</div>
    ),
    __valueChangeHandler: () => valueChangeHandler,
  };
});

jest.mock('lucide-react', () => ({
  Check: () => <svg data-testid="check-icon" />,
  ChevronsUpDown: () => <svg data-testid="chevrons-icon" />,
}));

describe('GroupSelector', () => {
  const mockOnChange = jest.fn();
  const mockSetAvailableGroups = jest.fn();

  const mockGroups: Group[] = [
    {
      id: 'group-1',
      name: 'Design',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'group-2',
      name: 'Marketing',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockValue: GroupValue = {
    id: 'group-1',
    name: 'Design',
    isNew: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder when no value is provided', () => {
    render(
      <GroupSelector
        value={undefined}
        onChange={mockOnChange}
        availableGroups={mockGroups}
        setAvailableGroups={mockSetAvailableGroups}
      />
    );

    const button = screen.getByTestId('main-button');
    expect(button).toHaveTextContent('Select group');
  });

  it('renders with selected value when provided', () => {
    render(
      <GroupSelector
        value={mockValue}
        onChange={mockOnChange}
        availableGroups={mockGroups}
        setAvailableGroups={mockSetAvailableGroups}
      />
    );

    const button = screen.getByTestId('main-button');
    expect(button).toHaveTextContent('Design');
  });

  it('renders available groups as options', () => {
    render(
      <GroupSelector
        value={mockValue}
        onChange={mockOnChange}
        availableGroups={mockGroups}
        setAvailableGroups={mockSetAvailableGroups}
      />
    );

    const items = screen.getAllByTestId('command-item');
    expect(items.length).toBe(mockGroups.length);
    expect(items[0]).toHaveTextContent('Design');
    expect(items[1]).toHaveTextContent('Marketing');
  });

  it('selects a group when clicked', () => {
    render(
      <GroupSelector
        value={undefined}
        onChange={mockOnChange}
        availableGroups={mockGroups}
        setAvailableGroups={mockSetAvailableGroups}
      />
    );

    const items = screen.getAllByTestId('command-item');
    fireEvent.click(items[1]);

    expect(mockOnChange).toHaveBeenCalledWith({
      id: 'group-2',
      name: 'Marketing',
      isNew: false,
    });
  });

  it('allows creating a new group', () => {
    render(
      <GroupSelector
        value={undefined}
        onChange={mockOnChange}
        availableGroups={mockGroups}
        setAvailableGroups={mockSetAvailableGroups}
      />
    );

    const input = screen.getByTestId('command-input');
    fireEvent.change(input, { target: { value: 'New Group' } });

    const addButton = screen.getByTestId('add-button');
    expect(addButton).toHaveTextContent('Add "New Group"');
    fireEvent.click(addButton);

    expect(mockSetAvailableGroups).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Group',
      isNew: true
    }));
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <GroupSelector
        value={undefined}
        onChange={mockOnChange}
        availableGroups={mockGroups}
        setAvailableGroups={mockSetAvailableGroups}
        disabled={true}
      />
    );

    const button = screen.getByTestId('main-button');
    expect(button).toBeDisabled();
  });
}); 