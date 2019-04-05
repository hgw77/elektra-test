import * as types from './actionTypes';
// wrapper for axios -> app/javascript/ajax_helper.js
import { ajaxHelper,  pluginAjaxHelper} from 'ajax_helper';
import { addNotice as showNotice, addError as showError } from 'lib/flashes';
import { ErrorsList } from 'lib/elektra-form/components/errors_list';

// the `ajaxHelper` is set up in init.js to talk to the Maia-Metrics API, so we need a
// separate AJAX helper for talking to Elektra
const elektraMetricsAjaxHelper = pluginAjaxHelper('metrics', {
  headers: {'X-Requested-With': 'XMLHttpRequest'},
});

// const actionName= () => {
//  return { type: constant.ACTION_NAME, data: somedata }
// }
// type is the action. It is used in the reducer switch to handle the correct action

// this is the data structure that is dispatched into the reducer switch
const requestMetricsData = () => {
  return {
    type: types.REQUEST_DISK_METRICS_DATA,
    requestedAt: Date.now()
  }
}
// this is the data structure that is dispatched into the reducer switch
const requestMetricsDataFailure = () => {
  return { type: types.REQUEST_DISK_METRICS_DATA_FAILURE }
}
// this is the data structure that is dispatched into the reducer switch
const receiveMetricsData = (metrics_data, instanceId, startTime, endTime, step) => {
  return {
    type: types.RECEIVE_DISK_METRICS_DATA,
    metrics_data: metrics_data,
    receivedAt: Date.now(),
    instanceId: instanceId,
    startTime: startTime,
    endTime: endTime,
    step: step
  }
}

// HELPER
const shouldFetchMetrics= function(state) {
  if (state.diskMetrics.isFetching || state.diskMetrics.requestedAt) {
    return false;
  } else {
    return true;
  }
};

// ACTIONS
const fetchMetricsDataIfNeeded= (instanceId) => (
  function(dispatch, getState) {
    console.log("fetchMetricsDataIfNeeded");
    // check if it is allready fetching
    if (shouldFetchMetrics(getState())) {
      return dispatch(fetchMetricsData(instanceId));
    }
  }
);

const handleStartTimeChange= (startTime,step) => (
  function(dispatch, getState) {
    // check if it is allready fetching
    console.log("handleActionStartTimeChange");
    // instanceId already in the store
    return dispatch(fetchMetricsData(undefined,startTime,undefined,step));
  }
);

// fetch real data from backend and put it into the reducer
const fetchMetricsData= (instanceId, startTime, endTime, step) =>
  function(dispatch, getState) {
    console.log("fetchMetricsData");

    // get default time frame from state
    var state = getState();
    if (!instanceId) instanceId = state.diskMetrics.instanceId;
    if (!startTime) startTime = state.diskMetrics.startTime;
    if (!endTime) endTime = state.diskMetrics.endTime;
    if (!step) step = state.diskMetrics.step;

    if (startTime > endTime) {
      showError("Start time should not bevore end time!");
      console.log("start time:"+startTime+" end time:"+endTime);
    }
    else {
      // 1) start request by setting the date
      // dispatch is calling the reducer switch
      dispatch(requestMetricsData());
      // https://prometheus.io/docs/prometheus/latest/querying/api/
      // https://prometheus.io/docs/prometheus/latest/querying/basics/
      // https://documentation.global.cloud.sap/docs/metrics/metrics.html
      const promises = [];
      promises.push (
        ajaxHelper.get(`query_range?query=vcenter_virtualDisk_read_average+{instance_uuid='${instanceId}'}&start=${startTime/1000}&end=${endTime/1000}&step=${step}`)
      );
      promises.push (
        ajaxHelper.get(`query_range?query=vcenter_virtualDisk_write_average+{instance_uuid='${instanceId}'}&start=${startTime/1000}&end=${endTime/1000}&step=${step}`)
      );

      Promise.all(promises).then( (responses) => {
        // 2) to have the data in the store dispatch the response into the reducer
        // console.log(response
        var diskIoData = {
          read: responses[0].data.data.result[0],
          write: responses[1].data.data.result[0]
        }
        return dispatch(receiveMetricsData(diskIoData, instanceId, startTime, endTime, step));
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
  handleStartTimeChange,
}
