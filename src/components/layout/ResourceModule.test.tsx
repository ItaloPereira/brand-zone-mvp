import '@testing-library/jest-dom';

import { render } from '@testing-library/react';

import ResourceModule from './ResourceModule';

describe('ResourceModule', () => {
  it('renders all sections with provided children', () => {
    const header = <div data-testid="header">Header Content</div>;
    const filters = <div data-testid="filters">Filters Content</div>;
    const toggles = <div data-testid="toggles">Toggles Content</div>;
    const appliedFilters = <div data-testid="applied-filters">Applied Filters</div>;
    const children = <div data-testid="children">Main Content</div>;

    const { getByTestId } = render(
      <ResourceModule
        header={header}
        filters={filters}
        toggles={toggles}
        appliedFilters={appliedFilters}
      >
        {children}
      </ResourceModule>
    );

    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('filters')).toBeInTheDocument();
    expect(getByTestId('toggles')).toBeInTheDocument();
    expect(getByTestId('applied-filters')).toBeInTheDocument();
    expect(getByTestId('children')).toBeInTheDocument();
  });

  it('maintains the correct layout structure', () => {
    const header = <div>Header</div>;
    const filters = <div>Filters</div>;
    const toggles = <div>Toggles</div>;
    const appliedFilters = <div>Applied Filters</div>;
    const children = <div>Main Content</div>;

    const { container } = render(
      <ResourceModule
        header={header}
        filters={filters}
        toggles={toggles}
        appliedFilters={appliedFilters}
      >
        {children}
      </ResourceModule>
    );

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBe(2);

    expect(sections[0].textContent).toContain('Header');

    expect(sections[1].textContent).toContain('Filters');
    expect(sections[1].textContent).toContain('Toggles');
    expect(sections[1].textContent).toContain('Applied Filters');

    expect(container.textContent).toContain('Main Content');
  });
}); 