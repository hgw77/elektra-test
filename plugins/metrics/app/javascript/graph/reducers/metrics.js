import * as types from '../actions/actionTypes';
import initialState from './initialState';

const requestMetricsData = (state,{ requestedAt }) => {
  return Object.assign({}, state, {
    isFetching: true,
    requestedAt
  });
}

const requestMetricsDataFailure = (state) => {
  return Object.assign({}, state, {
    isFetching: false
  });
};

const receiveMetricsData = (state,{ metrics_data,instanceId,startTime,endTime,receivedAt,steps }) => {
  return Object.assign({},state,{
    isFetching: false,
    data: metrics_data,
    instanceId: instanceId,
    startTime: startTime,
    endTime: endTime,
    steps:steps,
    receivedAt
  });
}

// all reducers are called on each dispatch!
// switch to handle the correct action that was dispatched
export const metrics = function(state = initialState, action) {
  console.log('metics-reducers-switch');
  console.log(action);
  switch (action.type) {
    case types.RECEIVE_METRICS_DATA:
      return receiveMetricsData(state,action);
    case types.REQUEST_METRICS_DATA:
      return requestMetricsData(state,action);
    case types.REQUEST_METRICS_DATA_FAILURE:
      return requestMetricsDataFailure(state,action);

    // return new state
    default: return state;
  }
};
