import Relay from 'react-relay';

export default {
  result: (Component) => Relay.QL`
    query {
      search{
        ${Component.getFragment('result')}
    }
	}
  `
};
