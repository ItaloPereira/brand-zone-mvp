import '@testing-library/jest-dom';

import type { Tag } from '@prisma/client';
import { fireEvent, render, screen } from '@testing-library/react';

import { TagSelector, type TagValue } from './TagSelector';

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

describe('TagSelector', () => {
  const mockOnChange = jest.fn();
  const mockSetAvailableTags = jest.fn();

  const mockTags: Tag[] = [
    {
      id: 'tag-1',
      name: 'Red',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tag-2',
      name: 'Blue',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tag-3',
      name: 'Green',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockSelectedTags: TagValue[] = [
    {
      id: 'tag-1',
      name: 'Red',
      isNew: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder when no tags are selected', () => {
    render(
      <TagSelector
        value={[]}
        onChange={mockOnChange}
        availableTags={mockTags}
        setAvailableTags={mockSetAvailableTags}
      />
    );

    const button = screen.getByTestId('main-button');
    expect(button).toHaveTextContent('Select tags');
  });

  it('shows selected tags count when tags are selected', () => {
    render(
      <TagSelector
        value={mockSelectedTags}
        onChange={mockOnChange}
        availableTags={mockTags}
        setAvailableTags={mockSetAvailableTags}
      />
    );

    const button = screen.getByText('1 tag selected');
    expect(button).toBeInTheDocument();
  });

  it('shows correct count for multiple tags', () => {
    const multipleTags = [...mockSelectedTags, { id: 'tag-2', name: 'Blue', isNew: false }];
    render(
      <TagSelector
        value={multipleTags}
        onChange={mockOnChange}
        availableTags={mockTags}
        setAvailableTags={mockSetAvailableTags}
      />
    );

    const multipleButton = screen.getByText('2 tags selected');
    expect(multipleButton).toBeInTheDocument();
  });

  it('renders available tags as options', () => {
    render(
      <TagSelector
        value={mockSelectedTags}
        onChange={mockOnChange}
        availableTags={mockTags}
        setAvailableTags={mockSetAvailableTags}
      />
    );

    const items = screen.getAllByTestId('command-item');
    expect(items.length).toBe(mockTags.length);
    expect(items[0]).toHaveTextContent('Red');
    expect(items[1]).toHaveTextContent('Blue');
    expect(items[2]).toHaveTextContent('Green');
  });

  it('adds a tag when selected', () => {
    render(
      <TagSelector
        value={[]}
        onChange={mockOnChange}
        availableTags={mockTags}
        setAvailableTags={mockSetAvailableTags}
      />
    );

    const items = screen.getAllByTestId('command-item');
    fireEvent.click(items[0]);

    expect(mockOnChange).toHaveBeenCalledWith([{
      id: 'tag-1',
      name: 'Red',
      isNew: false,
    }]);
  });

  it('removes a tag when unselected', () => {
    render(
      <TagSelector
        value={mockSelectedTags}
        onChange={mockOnChange}
        availableTags={mockTags}
        setAvailableTags={mockSetAvailableTags}
      />
    );

    const items = screen.getAllByTestId('command-item');
    fireEvent.click(items[0]);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('allows creating a new tag', () => {
    render(
      <TagSelector
        value={[]}
        onChange={mockOnChange}
        availableTags={mockTags}
        setAvailableTags={mockSetAvailableTags}
      />
    );

    const input = screen.getByTestId('command-input');
    fireEvent.change(input, { target: { value: 'Yellow' } });

    const addButton = screen.getByText('Add "Yellow"');
    expect(addButton).toHaveTextContent('Add "Yellow"');
    fireEvent.click(addButton);

    expect(mockSetAvailableTags).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith([expect.objectContaining({
      name: 'Yellow',
      isNew: true
    })]);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <TagSelector
        value={[]}
        onChange={mockOnChange}
        availableTags={mockTags}
        setAvailableTags={mockSetAvailableTags}
        disabled={true}
      />
    );

    const button = screen.getByTestId('main-button');
    expect(button).toBeDisabled();
  });
}); 