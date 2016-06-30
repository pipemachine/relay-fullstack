import Relay from 'react-relay';
import Feature from './FeatureComponent';

export default Relay.createContainer(Feature, {
  initialVariables:{
    searchStr: ""
  },
  fragments: {
    result: () => Relay.QL`
       fragment on Search {
         results(first:25,searchStr: $searchStr){
          edges {
            node {
              id
              name
              price
              url
            }
          } 
        }
      }`
  }
});
