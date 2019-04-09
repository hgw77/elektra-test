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
    type: types.REQUEST_CPU_METRICS_DATA,
    requestedAt: Date.now()
  }
}
// this is the data structure that is dispatched into the reducer switch
const requestMetricsDataFailure = () => {
  return { type: types.REQUEST_CPU_METRICS_DATA_FAILURE }
}
// this is the data structure that is dispatched into the reducer switch
const receiveMetricsData = (metricsData, instanceId, sliderValue, step) => {
  return {
    type: types.RECEIVE_CPU_METRICS_DATA,
    metricsData: metricsData,
    receivedAt: Date.now(),
    instanceId: instanceId,
    sliderValue: sliderValue,
    step: step
  }
}

// HELPER
const shouldFetchMetrics= function(state) {
  if (state.cpuMetrics.isFetching || state.cpuMetrics.requestedAt) {
    return false;
  } else {
    return true;
  }
};

// ACTIONS
const fetchMetricsDataIfNeeded= (instanceId,endTime) => (
  function(dispatch, getState) {
    //console.log("fetchMetricsDataIfNeeded");
    // check if it is allready fetching
    if (shouldFetchMetrics(getState())) {
      return dispatch(fetchMetricsData(instanceId,undefined,endTime));
    }
  }
);

const handleSliderValueChange= (sliderValue,endTime,step) => (
  function(dispatch, getState) {
    // check if it is allready fetching
    //console.log("handleActionStartTimeChange");
    // instanceId already in the store
    return dispatch(fetchMetricsData(undefined,sliderValue,endTime,step));
  }
);

// fetch real data from backend and put it into the reducer
const fetchMetricsData= (instanceId, sliderValue, endTime, step) =>
  function(dispatch, getState) {
    //console.log("fetchMetricsData");

    // get default time frame from state
    var state = getState();
    if (!instanceId) instanceId = state.cpuMetrics.instanceId;
    if (!sliderValue) sliderValue = state.cpuMetrics.sliderValue;
    if (!endTime) endTime = state.cpuMetrics.initalEndTime;
    if (!step) step = state.cpuMetrics.step;

    if (sliderValue > endTime) {
      showError("Sorry, this error should not hapen! SliderValue should not bevore endTime...");
      //console.log("sliderValue:"+sliderValue+" endTime:"+endTime);
    }
    else {
      // 1) start request by setting the date
      // dispatch is calling the reducer switch
      dispatch(requestMetricsData());
      // https://prometheus.io/docs/prometheus/latest/querying/api/
      // https://prometheus.io/docs/prometheus/latest/querying/basics/
      // https://documentation.global.cloud.sap/docs/metrics/metrics.html
      ajaxHelper.get(`query_range?query=vcenter_cpu_usage_average+{instance_uuid='${instanceId}'}&start=${sliderValue}&end=${endTime}&step=${step}`)
        .then( (response) => {
          // 2) to have the data in the store dispatch the response into the reducer
          // console.log(response);
          return dispatch(receiveMetricsData(response.data.data.result[0], instanceId, sliderValue, step));
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
  handleSliderValueChange,
}
