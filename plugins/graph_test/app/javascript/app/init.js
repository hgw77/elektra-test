// this is a special file needed for elektra to bring react to work
import { createWidget } from 'widget'
import * as reducers from './reducers';
import App from './components/application';

createWidget(__dirname).then((widget) => {
  widget.configureAjaxHelper(
    {
      baseURL: "/monsoon3/cc-demo/graph-test"
      // not working!!!! no idea why
      // widget.config.scriptParams.url
    }
  )
  widget.setPolicy()
  widget.createStore(reducers)
  widget.render(App)
})
