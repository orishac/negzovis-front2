import React from 'react';
import Swal from 'sweetalert2';
import Enzyme from 'enzyme';
import { mount } from 'enzyme';
import NTIRPsTable from '../NTIRPsTable'
import NTirpMatrix from '../NTIRPMatrix';
import Modal from 'react-bootstrap/Modal';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import mockData from '../tests/mocks/mockData.json'
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import 'jest-localstorage-mock';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;

const props = {
  ntable: mockData,
};


// Mock the window.pathOfTirps property
const mockPathOfTirps = {};
Object.defineProperty(window, 'pathOfTirps', {
  value: mockPathOfTirps,
  writable: true,
});

// Mock the NTIRPTimeLine component
jest.mock('../NTIRPTimeLine', () => {
  const NTIRPTimeLineMock = () => <div>NTIRPTimeLine</div>;
  return NTIRPTimeLineMock;
});

jest.mock('sweetalert2')


const localStorageMock = {
  rootElement: props.ntable,
  negative: 'true',
  VMapFile: {
    8: 'A',
    18: 'B',
  },
  num_of_entities: 0,
  num_of_entities_class_1: 0,
  PassedFromSearch: 'false',
  min_ver_support: 0.5,
};

describe.skip('Component', () => {
  let wrapper;
  beforeAll(() => {
    window.open = jest.fn();
    global.localStorage = localStorageMock;
  });

  beforeEach(() => {
    JSON.parse = jest.fn().mockReturnValueOnce(props.ntable).mockReturnValueOnce(localStorageMock.VMapFile)
    wrapper = mount(<NTIRPsTable {...props}/>);
  });

  it('should render the component', () => {
    const { getByText, getByTestId } = render(<NTIRPsTable {...props} />);

    getByTestId('next-button').click()

    expect(getByText('Relations')).toBeInTheDocument()
  });
});
