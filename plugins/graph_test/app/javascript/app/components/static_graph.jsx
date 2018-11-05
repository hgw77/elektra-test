import { Line } from '@nivo/line';

export default (props) => {
  return (
    <div>
      <h4>Graph DEMO</h4>
      <Line
        width={900}
        height={400}
        margin={{
          top: 20,
          right: 20,
          bottom: 60,
          left: 80
        }}
        data={[{id: 'fake corp. A',data: [
              {x: 0,y: 7},
              {x: 1,y: 5},
              {x: 2,y: 11},
            ]}]}
        animate
        curve="monotoneX"
        xScale={{type: 'linear',min: 0,max: 'auto'}}
      />
    </div>
  );
}
