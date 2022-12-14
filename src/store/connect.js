import { ReduxContext } from "./StoreContext";
import React from "react";

export const connect = (mapStateToProps, mapDispatchToProps) => Component => {
    class Connect extends React.Component {
      constructor(props) {
        super(props);
  
        this.state = props.store.getState();
      }
  
      componentDidMount() {
        this.props.store.subscribe(state => {
          this.setState(state);
        });
      }
  
      render() {
        const { store } = this.props;
  
        return (
          <Component
            {...this.props}
            {...mapStateToProps(store.getState())}
            {...mapDispatchToProps(store.dispatch)}
          />
        );
      }
    }
  
    return props => (
      <ReduxContext.Consumer>
        {store => <Connect {...props} store={store} />}
      </ReduxContext.Consumer>
    );
  };