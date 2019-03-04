import * as constants from '../constants';
// wrapper for axios -> app/javascript/ajax_helper.js
import { ajaxHelper,  pluginAjaxHelper} from 'ajax_helper';
import { addNotice as showNotice, addError as showError } from 'lib/flashes';
import { ErrorsList } from 'lib/elektra-form/components/errors_list';

// ACTIONS
// const actionName= () => (
//  { type: constant.ACTION_NAME, data: somedata }
//)
// type is the type of action (is a string and comes from constans). It is used
// in the reducer switch to handle the correct action

// the `ajaxHelper` is set up in init.js to talk to the Maia-Metrics API, so we need a
// separate AJAX helper for talking to Elektra
const elektraMetricsAjaxHelper = pluginAjaxHelper('metrics', {
  headers: {'X-Requested-With': 'XMLHttpRequest'},
});

const requestMetricsData= () => (
  {
    type: constants.REQUEST_METRICS_DATA,
    requestedAt: Date.now()
  }
);

const requestMetricsDataFailure= () => (
  {
    type: constants.REQUEST_METRICS_DATA_FAILURE
  }
);

// this is the data structure that is dispatched as action into the reducer
const receiveMetricsData= (metrics_data, instanceId, startTime, endTime, steps) => (
  {
    type: constants.RECEIVE_METRICS_DATA,
    metrics_data: metrics_data,
    receivedAt: Date.now(),
    instanceId: instanceId,
    startTime: startTime,
    endTime: endTime,
    steps: steps
  }
);

const shouldFetchMetrics= function(state) {
  const { metrics } = state;
  if (metrics.isFetching || metrics.requestedAt) {
    return false;
  } else {
    return true;
  }
};

// DISPATCH ACTIONS
const fetchMetricsDataIfNeeded= (instanceId) => (
  function(dispatch, getState) {
    console.log("fetchMetricsDataIfNeeded");
    // check if it is allready fetching
    if (shouldFetchMetrics(getState())) {
      return dispatch(fetchMetricsData(instanceId));
    }
  }
);

const handleActionStartTimeChange= (startTime) => (
  function(dispatch, getState) {
    // check if it is allready fetching
    console.log("handleActionStartTimeChange");
    // instanceId already in the store
    return dispatch(fetchMetricsData(undefined,startTime));
  }
);

const handleActionStepsChange= (steps) => (
  function(dispatch, getState) {
    // check if it is allready fetching
    console.log("handleActionStepsChange");
    // instanceId already in the store
    return dispatch(fetchMetricsData(undefined,undefined,undefined,steps));
  }
);

// fetch real data from backend and put it into the reducer
const fetchMetricsData= (instanceId, startTime, endTime, steps) =>
  function(dispatch, getState) {
    console.log("fetchMetricsData");

    // get default time frame from state
    var state = getState();
    if (!instanceId) instanceId = state.metrics.instanceId;
    if (!startTime) startTime = state.metrics.startTime;
    if (!endTime) endTime = state.metrics.endTime;
    if (!steps) steps = state.metrics.steps;

    if (startTime > endTime) {
      showError("Start time should not bevore end time!");
      console.log("start time:"+startTime+" end time:"+endTime);
    }
    else {
      // 1) start request by setting the date
      dispatch(requestMetricsData());
      // response comes from ajaxHelper
      elektraMetricsAjaxHelper.get(`get_metrics/?instance_id=${instanceId}&start_time=${startTime}&end_time=${endTime}&steps=${steps}`)
        .then( (response) => {
          // 2) to have the data in the store dispatch the response into the reducer
          return dispatch(receiveMetricsData(response.data, instanceId, startTime, endTime, steps));
        })
        .catch( (error) => {
          dispatch(requestMetricsDataFailure());
          showError(`Could not load metrics data (${error.message})`)
        });
    }
  }

// export actions that are public and used in container where actions are dispatched for related component
export {
  fetchMetricsDataIfNeeded,
  handleActionStartTimeChange,
  handleActionStepsChange
}
