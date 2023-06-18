import React from 'react';
import Enzyme from 'enzyme';
import { mount } from 'enzyme';
import NTirpMatrix from '../NTIRPMatrix';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;

describe('NTirpMatrix', () => {
    const props = {
        show: true,
        tirp: {
            elements: [[1, 2], [3, 4]],
        },
        currentlevel: 1,
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

    beforeAll(() => {
        global.localStorage = localStorageMock;
    });

    it('should render a table', () => {
      const wrapper = mount(<NTirpMatrix {...props} />);
      expect(wrapper.find('table')).toHaveLength(1);
    });

    it('should render a header with text "Relations"', () => {
      const wrapper = mount(<NTirpMatrix {...props} />);
      const header = wrapper.find('#relations-header');
      expect(header).toHaveLength(2);
    });

    it('should render the first column', () => {
        const wrapper = mount(<NTirpMatrix {...props} />);
        const table = wrapper.find('table');
        const rows = table.find('tr');
        expect(rows.at(1).find('td').at(0).text()).toEqual('A');
        expect(rows.at(2).find('td').at(0).text()).toEqual('B');
    });

    it('should render the relation matrix', () => {
        const wrapper = mount(<NTirpMatrix {...props} />);
        const table = wrapper.find('table');
        const rows = table.find('tr');
        expect(rows.at(1).find('td').at(1).text()).toEqual('equals');
        expect(rows.at(2).find('td').at(1).text()).toEqual('');
        expect(rows.at(1).find('td').at(2).text()).toEqual('before');
        expect(rows.at(2).find('td').at(2).text()).toEqual('before');
    });

    it('should render the matrix', () => {
      const wrapper = mount(<NTirpMatrix {...props} />);
      expect(wrapper.find('td').map((td) => td.text())).toEqual([
        '', 'B', 'C', 'D',
        'A','equals', 'before', 'before',
        'B', '', 'before', 'before',
        'C', '', '', 'equals'
      ]);
    });

    it('should update state when receiving new props', () => {
      const wrapper = mount(<NTirpMatrix {...props} />);
      wrapper.setProps({
        tirp: { elements: [['1'], ['2'], ['3']] },
        currentlevel: 2,
      });
      expect(wrapper.state('matrix')).toEqual([
        ['', 'B', 'C'],
        ['A', 'before', 'before'],
        ['B', '', 'before'],
      ]);
    });

    afterAll(() => {
        delete global.localStorage;
    });
});
