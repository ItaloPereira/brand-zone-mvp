import '@testing-library/jest-dom';

import { fireEvent, render } from '@testing-library/react';

import SearchInput from './SearchInput';

describe('SearchInput', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default value', () => {
    const { getByPlaceholderText } = render(
      <SearchInput onSearch={mockOnSearch} defaultValue="test query" />
    );

    const input = getByPlaceholderText('Search by image name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test query');
  });

  it('updates value on change', () => {
    const { getByPlaceholderText } = render(
      <SearchInput onSearch={mockOnSearch} defaultValue="" />
    );

    const input = getByPlaceholderText('Search by image name');
    fireEvent.change(input, { target: { value: 'new search' } });

    expect(input).toHaveValue('new search');
  });

  it('calls onSearch when Enter key is pressed', () => {
    const { getByPlaceholderText } = render(
      <SearchInput onSearch={mockOnSearch} defaultValue="" />
    );

    const input = getByPlaceholderText('Search by image name');
    fireEvent.change(input, { target: { value: 'search term' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('search term');
  });

  it('does not call onSearch when other keys are pressed', () => {
    const { getByPlaceholderText } = render(
      <SearchInput onSearch={mockOnSearch} defaultValue="" />
    );

    const input = getByPlaceholderText('Search by image name');
    fireEvent.change(input, { target: { value: 'search term' } });
    fireEvent.keyDown(input, { key: 'Tab' });

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('updates component state when defaultValue prop changes', () => {
    const { getByPlaceholderText, rerender } = render(
      <SearchInput onSearch={mockOnSearch} defaultValue="initial query" />
    );

    const input = getByPlaceholderText('Search by image name');
    expect(input).toHaveValue('initial query');

    rerender(<SearchInput onSearch={mockOnSearch} defaultValue="updated query" />);

    expect(input).toHaveValue('updated query');
  });
}); 