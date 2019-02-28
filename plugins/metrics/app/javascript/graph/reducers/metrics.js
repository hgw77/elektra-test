import * as constants from '../constants';
import moment from 'moment';

// metrics
const initialState = {
  data: {
    cpu_usage_average: [],
  },
  receivedAt: null,
  updatedAt: null,
  isFetching: false,
  instanceId: "",
  startTime: parseInt(moment().subtract(1, 'days').format('x')),
  endTime: parseInt(moment().format('x')),
  steps: 600
};

const requestMetricsData=(state,{requestedAt})=>
  Object.assign({}, state, {
    isFetching: true,
    requestedAt
  });

const requestMetricsDataFailure=function(state){
  return Object.assign({}, state, {
    isFetching: false
  });
};

// action with filtered keys
const receiveMetricsData=(state,{metrics_data,instanceId,startTime,endTime,receivedAt,steps})=>
  Object.assign({},state,{
    isFetching: false,
    data: metrics_data,
    instanceId: instanceId,
    startTime: startTime,
    endTime: endTime,
    steps:steps,
    receivedAt
  })
;

// all reducers are called on each dispatch!
// switch to handle the correct action that was dispatched
export const metrics = function(state, action) {
  if (state == null) { state = initialState; }
  console.log('metics-reducers-switch');
  console.log(state);
  console.log(action);
  switch (action.type) {
    case constants.RECEIVE_METRICS_DATA: return receiveMetricsData(state,action);
    case constants.REQUEST_METRICS_DATA: return requestMetricsData(state,action);
    case constants.REQUEST_METRICS_DATA_FAILURE: return requestMetricsDataFailure(state,action);

    // return new state
    default: return state;
  }
};
