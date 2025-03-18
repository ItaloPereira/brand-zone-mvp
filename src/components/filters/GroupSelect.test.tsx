import '@testing-library/jest-dom';

import type { Group } from '@prisma/client';
import { fireEvent, render, screen, within } from '@testing-library/react';

import GroupSelect from './GroupSelect';

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children, open }: {
    children: React.ReactNode;
    open: boolean;
  }) => (
    <div data-testid="popover" data-open={open.toString()}>
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
  Command: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command">{children}</div>
  ),
  CommandInput: ({ placeholder }: { placeholder: string }) => (
    <input data-testid="command-input" placeholder={placeholder} />
  ),
  CommandList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-list">{children}</div>
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
  Button: ({ children, variant, role, className, onClick }: {
    children: React.ReactNode;
    variant?: string;
    role?: string;
    className?: string;
    onClick?: () => void;
  }) => (
    <button
      data-testid="button"
      data-variant={variant}
      data-role={role}
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

describe('GroupSelect', () => {
  const mockOnSelect = jest.fn();

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
    {
      id: 'group-3',
      name: 'Development',
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with "All groups" as the default button text when no defaultValue is provided', () => {
    render(
      <GroupSelect
        availableGroups={mockGroups}
        onSelect={mockOnSelect}
      />
    );

    const button = screen.getByTestId('button');
    expect(button).toHaveTextContent('All groups');
  });

  it('renders the selected group name when defaultValue is provided', () => {
    render(
      <GroupSelect
        availableGroups={mockGroups}
        onSelect={mockOnSelect}
        defaultValue="group-2"
      />
    );

    const button = screen.getByTestId('button');
    expect(button).toHaveTextContent('Marketing');
  });

  it('renders all available groups plus "All groups" option in the command list', () => {
    render(
      <GroupSelect
        availableGroups={mockGroups}
        onSelect={mockOnSelect}
      />
    );

    const popoverContent = screen.getByTestId('popover-content');
    expect(popoverContent).toBeInTheDocument();

    const commandGroup = screen.getByTestId('command-group');
    const allGroupsItem = within(commandGroup).getByText('All groups');
    expect(allGroupsItem).toBeInTheDocument();

    mockGroups.forEach(group => {
      const groupItem = within(commandGroup).getByText(group.name);
      expect(groupItem).toBeInTheDocument();
    });
  });

  it('calls onSelect with "all" when the "All groups" option is selected', () => {
    render(
      <GroupSelect
        availableGroups={mockGroups}
        onSelect={mockOnSelect}
      />
    );

    const commandGroup = screen.getByTestId('command-group');
    const allGroupsItem = within(commandGroup).getByText('All groups').closest('[data-testid="command-item"]');
    fireEvent.click(allGroupsItem as HTMLElement);

    expect(mockOnSelect).toHaveBeenCalledWith('all');
  });

  it('calls onSelect with the group ID when a group option is selected', () => {
    render(
      <GroupSelect
        availableGroups={mockGroups}
        onSelect={mockOnSelect}
      />
    );

    // Find and click a group command item
    const marketingGroupItem = screen.getByText('Marketing').closest('[data-testid="command-item"]');
    fireEvent.click(marketingGroupItem as HTMLElement);

    expect(mockOnSelect).toHaveBeenCalledWith('group-2');
  });

  it('shows check icon next to the currently selected group', () => {
    render(
      <GroupSelect
        availableGroups={mockGroups}
        onSelect={mockOnSelect}
        defaultValue="group-2"
      />
    );

    const checkIcons = screen.getAllByTestId('check-icon');

    const visibleCheckParent = checkIcons.find(icon => {
      const parent = icon.parentElement;
      return parent && parent.textContent?.includes('Marketing');
    });

    expect(visibleCheckParent).toBeDefined();
  });

  it('shows check icon next to "All groups" when no group is selected', () => {
    render(
      <GroupSelect
        availableGroups={mockGroups}
        onSelect={mockOnSelect}
      />
    );

    const checkIcons = screen.getAllByTestId('check-icon');

    const visibleCheckParent = checkIcons.find(icon => {
      const parent = icon.parentElement;
      return parent && parent.textContent?.includes('All groups');
    });

    expect(visibleCheckParent).toBeDefined();
  });
}); 