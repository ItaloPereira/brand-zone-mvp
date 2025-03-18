import '@testing-library/jest-dom';

import type { Tag } from '@prisma/client';
import { fireEvent, render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import TagsSelect from './TagsSelect';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children, open }: {
    children: React.ReactNode;
    open: boolean;
  }) => (
    <div data-testid="popover" data-open={open?.toString()}>
      {children}
    </div>
  ),
  PopoverTrigger: ({ children, asChild }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (
    <div data-testid="popover-trigger" data-as-child={asChild?.toString()}>
      {children}
    </div>
  ),
  PopoverContent: ({ children, className }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="popover-content" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/command', () => ({
  Command: ({ children, className }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="command" className={className}>{children}</div>
  ),
  CommandInput: ({ placeholder }: { placeholder: string }) => (
    <input data-testid="command-input" placeholder={placeholder} />
  ),
  CommandList: ({ children, className }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="command-list" className={className}>{children}</div>
  ),
  CommandEmpty: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-empty">{children}</div>
  ),
  CommandGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-group">{children}</div>
  ),
  CommandItem: ({ children, value, onSelect }: {
    children: React.ReactNode;
    value: string;
    onSelect: () => void;
  }) => (
    <div
      data-testid="command-item"
      data-value={value}
      onClick={onSelect}
    >
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, role, size, className, onClick }: {
    children: React.ReactNode;
    variant?: string;
    role?: string;
    size?: string;
    className?: string;
    onClick?: () => void;
  }) => (
    <button
      data-testid="button"
      data-variant={variant}
      data-role={role}
      data-size={size}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
  ChevronsUpDown: () => <div data-testid="chevrons-icon" />,
}));

describe('TagsSelect', () => {
  const mockOnSelect = jest.fn();

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

  const mockSearchParams = {
    get: jest.fn().mockImplementation((key) => {
      if (key === 'tagIds') {
        return 'tag-1,tag-2';
      }
      return null;
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('renders with placeholder when no tags are selected', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    render(
      <TagsSelect
        availableTags={mockTags}
        onSelect={mockOnSelect}
        defaultValue={[]}
      />
    );

    const button = screen.getByRole('button', { name: /select tags/i });
    expect(button).toHaveTextContent('Select tags');
  });

  it('shows selected tags count when tags are selected', () => {
    render(
      <TagsSelect
        availableTags={mockTags}
        onSelect={mockOnSelect}
        defaultValue={['tag-1', 'tag-2']}
      />
    );

    const button = screen.getByRole('button', { name: /2 tags selected/i });
    expect(button).toHaveTextContent('2 tags selected');
  });

  it('uses singular form when only one tag is selected', () => {
    const singleTagMock = {
      get: jest.fn().mockImplementation((key) => {
        if (key === 'tagIds') {
          return 'tag-1';
        }
        return null;
      }),
    };

    (useSearchParams as jest.Mock).mockReturnValue(singleTagMock);

    const { container } = render(
      <TagsSelect
        availableTags={mockTags}
        onSelect={mockOnSelect}
        defaultValue={['tag-1']}
      />
    );

    const triggerButton = container.querySelector('[data-testid="button"][data-role="combobox"]');
    const span = triggerButton?.querySelector('span');
    expect(span).toHaveTextContent('1 tag selected');
  });

  it('renders all available tags in the command list', () => {
    render(
      <TagsSelect
        availableTags={mockTags}
        onSelect={mockOnSelect}
        defaultValue={[]}
      />
    );

    const popoverContent = screen.getByTestId('popover-content');
    expect(popoverContent).toBeInTheDocument();

    mockTags.forEach(tag => {
      const tagItem = screen.getByText(tag.name);
      expect(tagItem).toBeInTheDocument();
    });
  });

  it('renders apply button at bottom of popover', () => {
    render(
      <TagsSelect
        availableTags={mockTags}
        onSelect={mockOnSelect}
        defaultValue={[]}
      />
    );

    const applyButton = screen.getByText('Apply');
    expect(applyButton).toBeInTheDocument();
  });

  it('calls onSelect with selected tag IDs when Apply button is clicked', () => {
    render(
      <TagsSelect
        availableTags={mockTags}
        onSelect={mockOnSelect}
        defaultValue={['tag-1']}
      />
    );

    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);

    expect(mockOnSelect).toHaveBeenCalled();

    const callArgs = mockOnSelect.mock.calls[0][0];
    expect(Array.isArray(callArgs)).toBe(true);
    expect(callArgs).toContain('tag-1');
  });

  it('shows check icon next to selected tags', () => {
    render(
      <TagsSelect
        availableTags={mockTags}
        onSelect={mockOnSelect}
        defaultValue={['tag-1']}
      />
    );

    const checkIcons = screen.getAllByTestId('check-icon');

    const visibleCheckParent = checkIcons.find(icon => {
      const parent = icon.parentElement;
      return parent && parent.textContent?.includes('Red');
    });

    expect(visibleCheckParent).toBeDefined();
  });

  it('updates selected tags from search params when they change', () => {
    const initialTagsMock = {
      get: jest.fn().mockReturnValue('tag-1'),
    };
    (useSearchParams as jest.Mock).mockReturnValue(initialTagsMock);

    const { container, rerender } = render(
      <TagsSelect
        availableTags={mockTags}
        onSelect={mockOnSelect}
        defaultValue={['tag-1']}
      />
    );

    const firstTriggerButton = container.querySelector('[data-testid="button"][data-role="combobox"]');
    const firstSpan = firstTriggerButton?.querySelector('span');
    expect(firstSpan).toHaveTextContent('1 tag selected');

    const updatedTagsMock = {
      get: jest.fn().mockReturnValue('tag-1,tag-2'),
    };
    (useSearchParams as jest.Mock).mockReturnValue(updatedTagsMock);

    rerender(
      <TagsSelect
        availableTags={mockTags}
        onSelect={mockOnSelect}
        defaultValue={['tag-1']}
      />
    );

    const secondTriggerButton = container.querySelector('[data-testid="button"][data-role="combobox"]');
    const secondSpan = secondTriggerButton?.querySelector('span');
    expect(secondSpan).toHaveTextContent('2 tags selected');
  });
}); 