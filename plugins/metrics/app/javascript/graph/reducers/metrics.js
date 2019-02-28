import * as constants from '../constants';
import moment from 'moment';

// metrics
const initialState = {
  data: {
    cpu_usage_average: [],
    mem_usage_average: [],
    net_usage_average: [],
  },
  receivedAt: null,
  updatedAt: null,
  isFetching: false,
  server_id: "",
  start_time: parseInt(moment().subtract(1, 'days').format('x')),
  end_time: parseInt(moment().format('x')),
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
const receiveMetricsData=(state,{metrics_data,server_id,start_time,end_time,receivedAt,steps})=>
  Object.assign({},state,{
    isFetching: false,
    data: metrics_data,
    server_id: server_id,
    start_time: start_time,
    end_time: end_time,
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
