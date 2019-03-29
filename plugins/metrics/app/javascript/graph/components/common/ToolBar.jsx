// https://whoisandy.github.io/react-rangeslider/
import Slider from 'react-rangeslider'
// https://www.npmjs.com/package/react-moment
import moment from 'moment'

const ToolBar = ({state,onChange,onChangeComplete}) => {
  return (
    <div>
      <div className='toolbar toolbar-controlcenter'>
        <div>Time Zoom</div>
        <div style={{ "width":"250px", "marginRight":"15px" }}>
          <Slider
            min={parseInt(moment().subtract(7, 'days').format('x'))}
            max={parseInt(moment().subtract(1, 'hour').format('x'))}
            step={600}
            value={state.epochStartTime}
            onChange={onChange}
            onChangeComplete={onChangeComplete}
            tooltip={false}
          />
        </div>
        <div>{moment(state.epochStartTime).fromNow()}</div>
        <span className='toolbar-input-divider'>&ndash;</span>
        <div>messure point every {state.step}s</div>
      </div>
    </div>
  )
}

export default ToolBar
