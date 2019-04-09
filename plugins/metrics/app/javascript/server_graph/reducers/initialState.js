import moment from 'moment';

export default {
  cpu: {
    data: [],
    sliderValue: parseInt(moment().subtract(1, 'days').format('X')),
    step: 80,
    receivedAt: null,
    isFetching: false,
    instanceId: ""
  },
  memory: {
    data: [],
    sliderValue: parseInt(moment().subtract(1, 'days').format('X')),
    step: 80,
    receivedAt: null,
    isFetching: false,
    instanceId: ""
  },
  network: {
    data: [],
    sliderValue: parseInt(moment().subtract(1, 'days').format('X')),
    step: 80,
    receivedAt: null,
    isFetching: false,
    instanceId: ""
  },
  disk: {
    data: [],
    sliderValue: parseInt(moment().subtract(1, 'days').format('X')),
    step: 80,
    receivedAt: null,
    isFetching: false,
    instanceId: ""
  }
}
