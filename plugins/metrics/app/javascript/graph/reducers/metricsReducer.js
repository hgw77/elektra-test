import * as types from '../actions/actionTypes';
import initialState from './initialState';
import moment from 'moment';

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

const receiveMetricsData = (state,{ metrics_data,instanceId,startTime,endTime,receivedAt,step }) => {
  var values = metrics_data.values
  // prepare data for nivo line
  // https://nivo.rocks/line
  var data = values.map( value => {
    // https://devhints.io/moment
    //console.log (moment.unix(value[0]).format('YYYY-MM-DD HH:mm:ss'));
    var obj = {
      x: moment.unix(value[0]).format('YYYY-MM-DD HH:mm:ss'),
      y: parseFloat(value[1])/100
    };
    return obj
  });

  return Object.assign({},state,{
    isFetching: false,
    data: [{ data: data, id: metrics_data.metric.vmware_name }],
    instanceId: instanceId,
    startTime: startTime,
    endTime: endTime,
    step:step,
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
