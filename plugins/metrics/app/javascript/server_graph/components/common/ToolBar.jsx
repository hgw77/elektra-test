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
      sliderValue: this.props.sliderValue,
      max: parseInt(moment().format('X')),
      min: parseInt(moment().subtract(7, 'days').format('X'))
    }
  }

  // TIMEZOME SLIDER
  handleTimeZoomChange = (epoch) => {
    var newMax = parseInt(moment().format('X'));
    var newMin = parseInt(moment().subtract(7, 'days').format('X'));
    var timeFrame = newMax - epoch;
    var newStep = parseInt(timeFrame / this.state.resolution);
    if (newStep < 60) newStep = 60;
    this.setState({
      sliderValue: epoch,
      step: newStep,
      max: newMax,
      min: newMin
    })
  }

  handleTimeZoomChangeComplete = () => {
    this.props.handleSliderValueChange(this.state.sliderValue,this.state.max,this.state.step);
  }

  render() {
    return (
      <div>
        <div className='toolbar toolbar-controlcenter'>
          <div>Time Zoom</div>
          <div style={{ "width":"650px", "marginRight":"15px" }}>
            <Slider
              min={this.state.min}
              max={this.state.max}
              step={this.state.step}
              value={this.state.sliderValue}
              onChange={this.handleTimeZoomChange}
              onChangeComplete={this.handleTimeZoomChangeComplete}
              tooltip={false}
            />
          </div>
          <div>{moment(this.state.sliderValue*1000).fromNow()}</div>
          <span className='toolbar-input-divider'>&ndash;</span>
          <div>messure point every {moment.duration(this.state.step,'seconds').humanize()}</div>
          {this.props.isFetching ? <div><span className='spinner'> </span></div> : <div></div>}
        </div>
      </div>
    )
  }

}
