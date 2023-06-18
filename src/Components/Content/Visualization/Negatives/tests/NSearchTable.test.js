import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { Table } from 'react-bootstrap';
import NSearchTable from '../NSearchTable';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;

describe('NSearchTable', () => {
  let wrapper;
  const tirps = [
    {
      elements: [[1], [2], [3]],
      support: 10,
      'mean horizontal support': 2,
      'mean mean duration': 3,
    },
    {
      elements: [[4], [5]],
      support: 5,
      'mean horizontal support': 1,
      'mean mean duration': 2,
    },
  ];

  const localStorageMock = {
        negative: 'true',
        VMapFile: JSON.stringify({
            1: 'A',
            2: 'B',
            3: 'C',
            4: 'D',
        }),
    };

  beforeEach(() => {
    global.localStorage = localStorageMock;
    wrapper = mount(<NSearchTable tirps={tirps} />);
  });

  it('renders a table with correct columns', () => {
    const expectedColumns = ['Size', 'Symbols', 'V.S', 'M.H.S', 'M.M.D'];
    const columns = wrapper.find(Table).find('th');
    expect(columns.length).toEqual(expectedColumns.length);
    columns.forEach((column, index) => {
      expect(column.text()).toEqual(expectedColumns[index]);
    });
  });

  it('renders a table with correct data', () => {
    const expectedRows = [
      ['3', String.fromCharCode(172) +'A\r\nB\r\n' + String.fromCharCode(172)+ 'B', '10', '2.00', '3.00'],
      ['2', 'C\r\n' + String.fromCharCode(172) + 'C', '5', '1.00', '2.00'],
    ];
    const rows = wrapper.find(Table).find('tbody').find('tr');
    expect(rows.length).toEqual(expectedRows.length);
    rows.forEach((row, rowIndex) => {
      const cells = row.find('td');
      expect(cells.length).toEqual(expectedRows[rowIndex].length);
      cells.forEach((cell, cellIndex) => {
        expect(cell.text()).toEqual(expectedRows[rowIndex][cellIndex]);
      });
    });
  });

  it('sorts the table when a column header is clicked', () => {
    const expectedRows = [
      ['3', String.fromCharCode(172) +'A\r\nB\r\n' + String.fromCharCode(172)+ 'B', '10', '2.00', '3.00'],
      ['2', 'C\r\n' + String.fromCharCode(172) + 'C', '5', '1.00', '2.00'],
    ];
    const column = wrapper.find(Table).find('th').at(1);
    column.simulate('click');
    const rows = wrapper.find(Table).find('tbody').find('tr');
    expect(rows.length).toEqual(expectedRows.length);
    rows.forEach((row, rowIndex) => {
      const cells = row.find('td');
      expect(cells.length).toEqual(expectedRows[rowIndex].length);
      cells.forEach((cell, cellIndex) => {
        expect(cell.text()).toEqual(expectedRows[rowIndex][cellIndex]);
      });
    });
  });
})
