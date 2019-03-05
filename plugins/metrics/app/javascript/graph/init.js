// this is a special file needed for elektra to bring react to work
import { createWidget } from 'widget'
import * as reducers from './reducers';
import App from './components/application';

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
