import { Link } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { FadeTransition } from 'lib/components/transitions';
import { policy } from 'policy';
import { SearchField } from 'lib/components/search_field';
import EntryItem from './item';

export default class Entries extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {};

    this.toolbar = this.toolbar.bind(this)
    this.renderTable = this.renderTable.bind(this)
  }

  // This method is called when props are passed to the Component instance.
  // https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/component_will_receive_props.html
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');
    console.log(nextProps);
    // load dependencies unless already loaded
    this.loadDependencies(nextProps)
  }

  // https://reactjs.org/docs/react-component.html#componentdidmount
  // is invoked immediately after a component is mounted (inserted into the tree).
  // Initialization that requires DOM nodes should go here. If you need to load data
  // from a remote endpoint, this is a good place to instantiate the network request.
  componentDidMount() {
    console.log('componentDidMount');
    // load dependencies unless already loaded
    this.loadDependencies(this.props)
  }

  loadDependencies(props) {
    if(!props.active) return;
    console.log('loadDependencies');
    console.log(props);
    props.loadEntriesOnce()
  }

  toolbar() {
    return (
      <div className='toolbar'>
        <TransitionGroup>
          { this.props.items.length>=4 &&
            <FadeTransition>
              <SearchField
                onChange={(term) => this.props.filterEntries(term)}
                placeholder='name or description'
                text='Searches by name or description in visible entries list only.
                      Entering a search term will automatically start loading the next pages
                      and filter the loaded items using the search term. Emptying the search
                      input field will show all currently loaded items.'/>
            </FadeTransition>
          }
        </TransitionGroup>

        { policy.isAllowed('react_demo:entry_create') &&
          <Link to='/entries/new' className='btn btn-primary'>Create new</Link>
        }
      </div>
    )
  }

  renderTable() {
    console.log('renderTable');
    return (
      <table className='table entries'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.props.items && this.props.items.length>0 ? (
            this.props.items.map( (entry, index) =>
              !entry.isHidden &&
              <EntryItem
                key={index}
                entry={entry}
                handleDelete={this.props.handleDelete}/>
            )) : (
              <tr>
                <td colSpan="3">No Entries found.</td>
              </tr>
            )
          }
        </tbody>
      </table>
    )
  };

  render(){
    console.log('renderList');
    return (
      <div>
        { this.toolbar() }
        { !policy.isAllowed('react_demo:entry_list') ? (
          <span>You are not allowed to see this page</span>) : (
          this.props.isFetching ? <span className='spinner'></span> : this.renderTable()
        )}
      </div>
    )
  }
};
