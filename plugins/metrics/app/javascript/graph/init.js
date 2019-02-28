// this is a special file needed for elektra to bring react to work
import { createWidget } from 'widget'
import * as reducers from './reducers';
import App from './components/application';

createWidget(__dirname).then((widget) => {
  widget.configureAjaxHelper(
    {
      baseURL: widget.config.scriptParams.metricsApi
    }
  )
  widget.setPolicy()
  widget.createStore(reducers)
  widget.render(App)
})
