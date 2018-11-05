// this is a special file needed for elektra to bring react to work
import { createWidget } from 'widget'
import * as reducers from './reducers';
import App from './components/application';

createWidget(__dirname).then((widget) => {
  widget.configureAjaxHelper(
    {
      baseURL: widget.config.scriptParams.url
    }
  )
  console.log(widget.config.scriptParams.url)
  // app/javascript/widget.js
  widget.setPolicy()
  // create the store with defined middleware like ReduxThunk
  widget.createStore(reducers)
  // connects to store and renders App
  // making store available to all components without passing it explicitly
  // <Provider store = { this.store }>
  //   <App/>
  // </Provider>
  widget.render(App)
})
