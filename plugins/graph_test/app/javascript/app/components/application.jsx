import { HashRouter, Route, Redirect } from 'react-router-dom'
import StaticGraph from './static_graph';
import Tabs from './tabs';

import Metrics from '../containers/metrics'
// containers: react component thats uses the store and  supply props to the child components

const tabsConfig = [
  { to: '/static_graph', label: 'Static Graph', component: StaticGraph },
  { to: '/graph', label: 'Graph', component: Metrics }
]

// render all components inside a hash router
export default (props) =>
  <HashRouter /*hashType="noslash"*/ >
    <div>
      <Route exact path="/" render={ () => <Redirect to="/static_graph"/>}/>
      <Route path="/:activeTab" children={ ({match, location, history}) =>
        React.createElement(Tabs, Object.assign({}, {match, location, history, tabsConfig}, props))
      }/>
    </div>
  </HashRouter>
