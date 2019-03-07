import moment from 'moment';

export default {
  data: [],
  receivedAt: null,
  updatedAt: null,
  isFetching: false,
  instanceId: "",
  startTime: parseInt(moment().subtract(1, 'days').format('x')),
  endTime: parseInt(moment().format('x')),
  step: 80
}
