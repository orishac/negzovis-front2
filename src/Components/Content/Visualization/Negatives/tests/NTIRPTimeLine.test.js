import React from 'react';
import NTIRPTimeLine from '../NTIRPTimeLine';
import Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import { Card } from 'react-bootstrap';
import Chart from 'react-google-charts';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });



// mock the Chart component
jest.mock('react-google-charts', () => {
  const Chart = () => <div>Mocked Chart Component</div>;
  return Chart;
});

describe('NTIRPTimeLine component', () => {
  const vnames = {
    0: 'A',
    1: 'B'
  };
  const tirp = {
    elements: [[0], [1]],
    negatives: [false, false],
    durations: [10, 20],
    gaps: [5, 5],
  };

  it('should render without errors', () => {
    const wrapper = shallow(
      <NTIRPTimeLine vnames={vnames} tirp={tirp} />
    );
    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(Card.Header)).toHaveLength(1);
    expect(wrapper.find(Card.Body)).toHaveLength(1);
    expect(wrapper.find(Chart)).toHaveLength(1);
  });

  it('should render the correct chart data', () => {
    const wrapper = shallow(
      <NTIRPTimeLine vnames={vnames} tirp={tirp} />
    );
    const chartProps = wrapper.find(Chart).props();
    expect(chartProps.height).toEqual('200px');
    expect(chartProps.chartType).toEqual('Timeline');
    expect(chartProps.data).toHaveLength(3); // header + 2 data rows
    expect(chartProps.options).toBeDefined();
  });

  it('should create custom HTML content for tooltip', () => {
    const wrapper = shallow(
      <NTIRPTimeLine vnames={vnames} tirp={tirp} />
    );
    const instance = wrapper.instance();
    const html = instance.createCustomHTMLContent('Title', 'Duration: ', '10.00', ' Time Units');
    expect(html).toEqual('<div style="padding:5px 5px 5px 5px;"><b>Title</b><br>Duration: 10.00 Time Units</div>');
  });

  it('renders a Card with the correct header text and body content', () => {
    const props = {
      vnames: {
        1: 'A',
        2: 'B'
      },
      tirp: {
        elements: [[0], [1]],
        negatives: [false, false],
        durations: [10, 5],
        gaps: [2, 3],
      },
    };
    const wrapper = shallow(<NTIRPTimeLine {...props} />);
    const headerText = wrapper.find('.text-hugobot').text();
    expect(headerText).toBe('Mean Presentation');
    const chartComponent = wrapper.find(Chart);
    expect(chartComponent).toHaveLength(1);
  });

  it('returns the expected string when given certain input', () => {
    const wrapper = shallow(<NTIRPTimeLine vnames={vnames} tirp={tirp}/>);
    const title = 'Test';
    const duration = 'Duration:';
    const time = '1';
    const fourth = 'Time Units';
    const result1 = wrapper.instance().createCustomHTMLContent(title, duration, time, fourth);
    expect(result1).toBe('<div style="padding:5px 5px 5px 5px;"><b>Test</b><br>Duration:1 Time Unit</div>');
  
    const time2 = '3.14';
    const result2 = wrapper.instance().createCustomHTMLContent(title, duration, time2, fourth);
    expect(result2).toBe('<div style="padding:5px 5px 5px 5px;"><b>Test</b><br>Duration:3.14Time Units</div>');
  
    const time3 = '1';
    const fourth2 = 'Fourth';
    const result3 = wrapper.instance().createCustomHTMLContent(title, duration, time3, fourth2);
    expect(result3).toBe('<div style="padding:5px 5px 5px 5px;"><b>Test</b><br>Duration:1 Time Unit</div>');
  });

  it('computes correct dataset', () => {
    const props = {
      vnames : {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E'
      },
      tirp : {
          elements: [[0], [1, 2], [3], [4]],
          negatives: [false, false, true, false],
          durations: [10, 20, 30, 40],
          gaps: [1, 2, 3],
      }
   } 
    const wrapper = shallow(<NTIRPTimeLine {...props} />);
    const instance = wrapper.instance();
    const expectedDataset = [
        [
            { type: "string", id: "Elements" },
            { type: "string", id: "dummy bar label" },
            { type: "string", role: "tooltip", p: { html: true } },
            { type: "number", id: "Start" },
            { type: "number", id: "End" },
        ],
        ["A", "", '<div style="padding:5px 5px 5px 5px;"><b>A</b><br> Duration: 10.00 Time Units</div>', 0, 10000],
        ["B", "", '<div style="padding:5px 5px 5px 5px;"><b>B</b><br>Duration: 20.00 Time Units</div>', 11000, 31000],
        ["C", "", '<div style="padding:5px 5px 5px 5px;"><b>C</b><br>Duration: 20.00 Time Units</div>', 11000, 31000],
        [String.fromCharCode(172) + "D", "", '<div style="padding:5px 5px 5px 5px;"><b>' + String.fromCharCode(172) + 'D</b><br>Duration: 30.00 Time Units</div>', 33000, 63000],
        ["E", "", '<div style="padding:5px 5px 5px 5px;"><b>E</b><br> Duration: 40.00 Time Units</div>', 66000, 106000],
    ]
    expect(instance.computeNDataset(props.vnames, props.tirp.elements, props.tirp.negatives, props.tirp.durations, props.tirp.gaps))
    .toEqual(expectedDataset);
});
});
