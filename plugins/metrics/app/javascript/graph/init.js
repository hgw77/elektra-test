// this is a special file needed for elektra to bring react to work
import { createWidget } from 'widget'
import * as reducers from './reducers';
import App from './components/application';

// index <- includes
//          reducers/*
//          ./components/application
//          application <- includes
//                         container/xxx <- includes
//                                          component/xxx (view)
//                                          actions/* <- includes
//                                                       actionTypes/*
//                                                    <- dispatch to
//                                                       reducer <- includes
//                                                                  actionTypes/*
//                                                                  initialState
// Note: in standard react-redux component and container are in the same component file

//   component -> action -> reducer -> store -> returns new object -|
//   ^------------------- render new -------------------------------|

createWidget(__dirname).then((widget) => {
  maiaHeaders: { 'X-Auth-Token': widget.config.scriptParams.token }
  widget.configureAjaxHelper(
    {
      baseURL: widget.config.scriptParams.metricsApi,
      headers: maiaHeaders,
    }
  )
  widget.setPolicy()
  widget.createStore(reducers)
  widget.render(App)
})
