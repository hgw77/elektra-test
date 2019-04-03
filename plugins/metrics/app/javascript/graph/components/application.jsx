import { HashRouter, Route, Redirect } from 'react-router-dom'
import Tabs from './tabs';

import cpuMetrics from '../containers/cpuMetricsContainer'
import memoryMetrics from '../containers/memoryMetricsContainer'
// containers: react component thats uses the store and supply props to the child components

const tabsConfig = [
  { to: '/cpu', label: 'CPU', component: cpuMetrics },
  { to: '/memory', label: 'Memory', component: memoryMetrics }
]

// render all components inside a hash router
export default (props) =>
  <HashRouter /*hashType="noslash"*/ >
    <div>
      <Route exact path="/" render={ () => <Redirect to="/cpu"/>}/>
      <Route path="/:activeTab" children={ ({match, location, history}) =>
        React.createElement(Tabs, Object.assign({}, {match, location, history, tabsConfig}, props))
      }/>
    </div>
  </HashRouter>
