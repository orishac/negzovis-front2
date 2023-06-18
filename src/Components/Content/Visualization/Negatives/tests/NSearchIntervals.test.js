import React from 'react';
import Enzyme from 'enzyme';
import { mount } from 'enzyme';
import NSearchIntervals from '../NSearchIntervals';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;


describe('NSearchIntervals wrapper', () => {
	const props = {
		title: "Test Title",
		changeList: jest.fn()
};

  const localStorageMock = {
    negative: 'true',
    VMapFile: JSON.stringify({
        1: 'A',
        2: 'B',
        3: 'C',
        4: 'D',
    }),
  };

	// mock local storage
	const mockData = {
		vnames: [
		'A', String.fromCharCode(172) + 'A',
		'B', String.fromCharCode(172) + 'B', 
		'C', String.fromCharCode(172) + 'C', 
		'D', String.fromCharCode(172) + 'D',
		]
	};

	let wrapper;
	beforeEach(() => {
		global.localStorage = localStorageMock;
		wrapper = mount(<NSearchIntervals {...props}/>);
	});

  it('renders a table', () => {
    expect(wrapper.find('table')).toHaveLength(1);
  });

  it('renders a checkbox for selecting all items', () => {
    expect(wrapper.find('thead input[type="checkbox"]')).toHaveLength(1);
  });

  it('renders two rows for each item in the vnames state', () => {
    expect(wrapper.find('tbody tr')).toHaveLength(8);
  });

  it('renders the correct text for each item', () => {
    const rows = wrapper.find('tbody tr');
    expect(rows.at(0).find('td').at(1).text()).toEqual('A');
    expect(rows.at(1).find('td').at(1).text()).toEqual(String.fromCharCode(172) +'A');
    expect(rows.at(2).find('td').at(1).text()).toEqual('B');
		expect(rows.at(3).find('td').at(1).text()).toEqual(String.fromCharCode(172) +'B');
		expect(rows.at(4).find('td').at(1).text()).toEqual('C');
		expect(rows.at(5).find('td').at(1).text()).toEqual(String.fromCharCode(172) +'C');
		expect(rows.at(6).find('td').at(1).text()).toEqual('D');
		expect(rows.at(7).find('td').at(1).text()).toEqual(String.fromCharCode(172) +'D');
  });

	it('renders the correct text when VMAP is empty', () => {
		const localStorageMock = {
			negative: true,
			VMapFile: JSON.stringify({}),
		};

		global.localStorage = localStorageMock;
		wrapper = mount(<NSearchIntervals />);

    const rows = wrapper.find('tbody tr');
    expect(JSON.stringify(rows.at(0).find('td'))).toBe('{}')
  });

  it('allows the user to select and deselect items', () => {
    const rows = wrapper.find('tbody tr');
    // Click the second item to deselect it
    rows.at(1).simulate('click');
    expect(wrapper.state('selected')).toEqual([
			'A',
			'B', String.fromCharCode(172) + 'B', 
			'C', String.fromCharCode(172) + 'C', 
			'D', String.fromCharCode(172) + 'D'
		]);
    expect(rows.at(1).find('input[type="checkbox"]').prop('checked')).toEqual(true);
    // Click the second item again to select it
    rows.at(1).simulate('click');
    expect(wrapper.state('selected')).toEqual([
			'A', 
			'B', String.fromCharCode(172) + 'B', 
			'C', String.fromCharCode(172) + 'C', 
			'D', String.fromCharCode(172) + 'D',
			String.fromCharCode(172) + 'A',
		]);
    expect(rows.at(1).find('input[type="checkbox"]').prop('checked')).toEqual(true);
  });

  it('allows the user to filter the items', () => {
    const input = wrapper.find('input.filter-input');
    input.simulate('change', { target: { value: 'ABC' } });
    expect(wrapper.find('tbody tr')).toHaveLength(0);
    input.simulate('change', { target: { value: '' } });
    expect(wrapper.find('tbody tr')).toHaveLength(8);
  });
  
  // Test that selecting all items works
  it('allows the user to select all items', () => {
    const input = wrapper.find('input[type="checkbox"]').at(0);
    input.simulate('change');
    expect(wrapper.state().selected).toEqual([]);
    input.simulate('change');
    expect(wrapper.state().selected).toEqual(mockData.vnames);
  });
  
  // Test that selecting individual items works
  it('allows the user to select individual items', () => {
    const firstCheckbox = wrapper.find('input[type="checkbox"]').at(1);
    firstCheckbox.simulate('change');
    expect(wrapper.state().selected).toEqual([
			String.fromCharCode(172) + 'A',
			'B', String.fromCharCode(172) + 'B', 
			'C', String.fromCharCode(172) + 'C', 
			'D', String.fromCharCode(172) + 'D',
		]);
    const secondCheckbox = wrapper.find('input[type="checkbox"]').at(2);
    secondCheckbox.simulate('change');
    expect(wrapper.state().selected).toEqual([
			'B',String.fromCharCode(172) + 'B', 
			'C', String.fromCharCode(172) + 'C', 
			'D', String.fromCharCode(172) + 'D',
			]);
    firstCheckbox.simulate('change');
    expect(wrapper.state().selected).toEqual([
			'B',String.fromCharCode(172) + 'B', 
			'C', String.fromCharCode(172) + 'C', 
			'D', String.fromCharCode(172) + 'D',
			'A',
			]);
  });

	afterAll(() => {
		delete global.localStorage;
	});
})
