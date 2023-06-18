import React from 'react';
import Enzyme, { mount } from 'enzyme';
import NTIRPsSearch from '../NTIRPsSearch';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import NSearchTable from '../NSearchTable';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;

const props = {
    ntable: [{"durations":[1.0,15.381336127261717],"elements":[[8],[8]],"gaps":[0.0],"mean horizontal support":2.794022790797678,"mean mean duration":16.381336127261733,"negatives":[false,true],"support":5000},
    {"durations":[1.0,10.719659081750578],"elements":[[8],[18]],"gaps":[0.0],"mean horizontal support":2.7938077832724146,"mean mean duration":11.719659081750569,"negatives":[false,true],"support":4651},
    {"durations":[1.0],"elements":[[8]],"gaps":[],"mean horizontal support":2.794022790797678,"mean mean duration":1.0,"negatives":[false],"support":4651},
    {"durations":[1.0,16.065497515127483],"elements":[[18],[18]],"gaps":[0.0],"mean horizontal support":2.1912580943570767,"mean mean duration":17.065497515127486,"negatives":[false,true],"support":4324},
    {"durations":[1.0],"elements":[[18]],"gaps":[],"mean horizontal support":2.192094313453537,"mean mean duration":1.0,"negatives":[false],"support":4326},
    {"durations":[5.648990156899009,1.0,15.409204292381236],"elements":[[18],[8],[8]],"gaps":[0.0,0.0],"mean horizontal support":2.38248436103664,"mean mean duration":22.058194449280204,"negatives":[true,false,true],"support":4476},
    {"durations":[5.647649674325282,1.0,10.224972589097929],"elements":[[18],[8],[18]],"gaps":[0.0,0.0],"mean horizontal support":2.382260947274352,"mean mean duration":16.87262226342322,"negatives":[true,false,true],"support":4476},
    {"durations":[5.648990156899009,1.0],"elements":[[18],[8]],"gaps":[0.0],"mean horizontal support":2.38248436103664,"mean mean duration":6.648990156899009,"negatives":[true,false],"support":4476},
    {"durations":[2.66390407],"elements":[[18]],"gaps":[],"mean horizontal support":2.5339389784024684,"mean mean duration":2.66390407,"negatives":[true],"support":5834},
    {"durations":[3.2364430798851314,1.0,16.0646683449945],"elements":[[8],[18],[18]],"gaps":[0.0,0.0],"mean horizontal support":2.1908396946564888,"mean mean duration":20.30111142487965,"negatives":[true,false,true],"support":4323},
    {"durations":[3.23989443568634,1.0],"elements":[[8],[18]],"gaps":[0.0],"mean horizontal support":2.1916763005780346,"mean mean duration":4.239894435686342,"negatives":[true,false],"support":4325},
    {"durations":[2.27890518],"elements":[[8]],"gaps":[],"mean horizontal support":3.115872471717518,"mean mean duration":2.27890518,"negatives":[true],"support":5834}],
};

const localStorageMock = {
    rootElement: {},
    negative: 'true',
    VMapFile: {
      1: 'A',
      2: 'B',
      3: 'C',
      4: 'D',
      8: 'Bamba',
      18: 'F'
    },
    min_ver_support: 0.5,
};

jest.mock('../NSearchMeanPresentation', () => {
    const NSearchMeanPresentationMock = () => <div>NSearchMeanPresentationMock</div>;
    return NSearchMeanPresentationMock;
});
  
jest.mock('../NTIRPTimeLine', () => {
    const NTIRPTimeLineMock = () => <div>NTIRPTimeLineMock</div>;
    return NTIRPTimeLineMock;
});
  
jest.mock('../NSearchIntervals', () => {
    const NSearchIntervalsMock = () => <div>NSearchIntervalsMock</div>;
    return NSearchIntervalsMock;
});
  
jest.mock('../SearchNLimits', () => {
    const SearchNLimitsMock = () => <div>SearchNLimitsMock</div>;
    return SearchNLimitsMock;
});

jest.mock('../NSearchGraph', () => {
    const NSearchGraphMock = () => <div>NSearchGraphMock</div>;
    return NSearchGraphMock;
});


describe('Integration Tests', () => {
  let wrapper;

  beforeAll(() => {
    global.localStorage = localStorageMock;
  });

  beforeEach(() => {
    JSON.parse = jest.fn().mockReturnValueOnce(props.ntable).mockReturnValue(localStorageMock.VMapFile)
    wrapper = mount(<NTIRPsSearch />);
  });


  it('should render the two components', () => {
    wrapper.setState({ searchResults: [props.ntable[0], props.ntable[1]], showGraph: false})
    const tableElement = wrapper.find('NSearchTable');
    const elementShown = wrapper.findWhere(node => {
      return (
        node.type() &&
        node.name() &&
        node.text() === "5000"
      );
    });
    expect(tableElement.exists()).toBe(true);
    expect(elementShown.exists()).toBe(true);
  });
});
