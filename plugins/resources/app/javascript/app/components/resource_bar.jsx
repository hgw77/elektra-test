import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { Scope } from '../scope';
import { Unit, valueWithUnit } from '../unit';

export default class ResourceBar extends React.Component {
  state = {}

  constructor(props) {
    super(props);
    this.outerDivRef = React.createRef();
  }

  //Immediately after each render, check if the label fits into the filled
  //portion of the progress bar, and add the CSS class "label-fits" to the bar
  //if necessary. This makes the label either show up in the filled portion (if
  //it fits) or in the empty portion of the bar.
  componentDidMount() {
    this.checkIfLabelFits();
  }
  componentDidUpdate() {
    this.checkIfLabelFits();
  }
  checkIfLabelFits(opts = {}) {
    const bar = this.outerDivRef.current; //this is the <div class="progress"/>
    if (!bar) {
      return;
    }

    //measure the width of the filled portion of the bar
    const filledBar = bar.querySelector('.has-label-if-fits');
    if (!filledBar) {
      //bar is completely full or empty, so we don't have to measure anything
      return;
    }
    const barWidth = filledBar.getBoundingClientRect().width;

    //measure the width of the label (one of them might be display:none and report width=0)
    const labelWidths = [...bar.querySelectorAll('.progress-bar-label')]
      .map(span => span.getBoundingClientRect().width);
    const labelWidth = Math.max(...labelWidths);

    //require some extra wiggle room (20px) around the label to account for UI
    //margins, and because labels that fit too tightly look dumb
    bar.classList.toggle('label-fits', labelWidth + 20 < barWidth);

    //re-run this method after animations have completed
    if (!opts.delayed) {
      window.setTimeout(() => this.checkIfLabelFits({ delayed: true }), 500);
    }
  }

  render() {
    //NOTE: `capacity` and `fill` are generic names. What they actually stand for is
    //defined where this component gets used.
    const {capacity, fill, unitName, isDanger, labelOverride, overcommitAfter, beforeOvercommitTooltip, afterOvercommitTooltip, showsCapacity} = this.props;
    const unit = new Unit(this.props.unitName || "");

    //indicate overcommit if necessary
    let beforeOcMark = undefined;
    let afterOcMark = undefined;
    if (overcommitAfter && overcommitAfter < capacity) {
      const ocStartPerc = Math.round(1000 * (overcommitAfter / capacity)) / 10;
      afterOcMark = <div className='progress-bar-after-overcommit' style={{left: `${ocStartPerc}%`}} />;

      if (afterOvercommitTooltip) {
        const tooltip = <Tooltip>{afterOvercommitTooltip}</Tooltip>;
        afterOcMark = <OverlayTrigger overlay={tooltip} placement='top'>{afterOcMark}</OverlayTrigger>;
      }
      if (beforeOvercommitTooltip) {
        beforeOcMark = <div className='progress-bar-before-overcommit' style={{right: `${100-ocStartPerc}%`}} />;
        const tooltip = <Tooltip>{beforeOvercommitTooltip}</Tooltip>;
        beforeOcMark = <OverlayTrigger overlay={tooltip} placement='top'>{beforeOcMark}</OverlayTrigger>;
      }
    }

    //get some edge cases out of the way first
    if (capacity == 0 && fill == 0) {
      return (
        <div className='progress' ref={this.outerDivRef}>
          <div key='filled' className='progress-bar progress-bar-disabled has-label' style={{width:'100%'}}>
            <span className='progress-bar-label'>
              {showsCapacity ? "No capacity" : "No quota" }
            </span>
          </div>
          {beforeOcMark}{afterOcMark}
        </div>
      );
    }

    let widthPerc = Math.round(1000 * (fill / capacity)) / 10;
    //ensure that a non-zero-wide bar is at least somewhat visible
    if (fill > 0 && widthPerc < 0.5) {
      widthPerc = 0.5;
    }

    //special cases: yellow and red bars
    let className = 'progress-bar';
    if (isDanger) {
      className = 'progress-bar progress-bar-danger progress-bar-striped';
    } else if (fill >= capacity) {
      className = 'progress-bar progress-bar-warning';
    }
    if (widthPerc > 100) {
      widthPerc = 100;
    }

    const label = labelOverride ? (
      <span className='progress-bar-label'>{labelOverride}</span>
    ) : (
      <span className='progress-bar-label'>
        {valueWithUnit(fill, unit)}/{valueWithUnit(capacity, unit)}
      </span>
    );
    return <div className='progress' ref={this.outerDivRef}>
      <div key='filled' className={`${className} has-label-if-fits`} style={{width:widthPerc+'%'}}>{label}</div>
      <div key='empty' className='progress-bar progress-bar-empty has-label-unless-fits'>{label}</div>
      {beforeOcMark}{afterOcMark}
    </div>;
  }

};
