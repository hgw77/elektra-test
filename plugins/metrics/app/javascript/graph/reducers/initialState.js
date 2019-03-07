import moment from 'moment';

export default {
  cpu: {
    data: [],
    startTime: parseInt(moment().subtract(1, 'days').format('x')),
    endTime: parseInt(moment().format('x')),
    step: 80,
    receivedAt: null,
    updatedAt: null,
    isFetching: false
  },
  memory: {
    data: [],
    startTime: parseInt(moment().subtract(1, 'days').format('x')),
    endTime: parseInt(moment().format('x')),
    step: 80,
    receivedAt: null,
    updatedAt: null,
    isFetching: false
  },
  instanceId: "",

}
