// https://whoisandy.github.io/react-rangeslider/
import Slider from 'react-rangeslider'
// https://www.npmjs.com/package/react-moment
import moment from 'moment'

export default class ToolBar extends React.Component {
  constructor(props){
  	super(props);
    // used for the slider
    this.state = {
      step: this.props.step,
      resolution: this.props.resolution,
      epochStartTime: this.props.startTime,
    }
  }

  // TIMEZOME SLIDER
  handleTimeZoomChange = (epoch) => {
    var timeFrame = (this.props.endTime - epoch)/1000; // epoch comes in milliseconds
    var newStep = parseInt(timeFrame / this.state.resolution);
    if (newStep < 30) newStep = 30;
    this.setState({
      epochStartTime: epoch,
      step: newStep
    })
  }

  handleTimeZoomChangeComplete = () => {
    this.props.handleStartTimeChange(this.state.epochStartTime,this.state.step);
  }

  render() {
    return (
      <div>
        <div className='toolbar toolbar-controlcenter'>
          <div>Time Zoom</div>
          <div style={{ "width":"250px", "marginRight":"15px" }}>
            <Slider
              min={parseInt(moment().subtract(7, 'days').format('x'))}
              max={parseInt(moment().subtract(1, 'hour').format('x'))}
              step={600}
              value={this.state.epochStartTime}
              onChange={this.handleTimeZoomChange}
              onChangeComplete={this.handleTimeZoomChangeComplete}
              tooltip={false}
            />
          </div>
          <div>{moment(this.state.epochStartTime).fromNow()}</div>
          <span className='toolbar-input-divider'>&ndash;</span>
          <div>messure point every {moment.duration(this.state.step,'seconds').humanize()}</div>
          {this.props.isFetching ? <div><span className='spinner'> </span></div> : <div></div>}
        </div>
      </div>
    )
  }

}
