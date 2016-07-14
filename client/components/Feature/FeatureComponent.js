/* eslint-disable global-require */
import React from 'react';
import { Grid,FABButton,Icon, Cell,Spinner, Card, CardTitle, CardText, CardActions, Button, Textfield} from 'react-mdl';
import Page from '../Page/PageComponent';
import styles from './Feature.scss';
import request from 'superagent';
import config from '../../../server/config/environment';


export default class Feature extends React.Component {
	static propTypes = {
	  result: React.PropTypes.object.isRequired
	};
	constructor(props){
	  super(props);
	  this.state = {
	    framesToShow: [],
	    showSpinner: false
	  };
	}
	trueCheck(array,item){
	  var check = false;
	  for(var i = 0;i<array.length;i++){
	    if(array[i]===item){
	      check=true;
	    }
	  }
	  return check
	}

	render() {
	    var spinner;
	    if (this.state.showSpinner){
	      spinner = <Spinner singleColor />
	    }
	    if(this.props.result.results.edges.length > 1){
	      spinner = null 
	    }
	    return(
	      <Page className={styles.main}>
	          <form onSubmit={this.handleSubmit.bind(this)} className={styles.searchForm}>
		      <Textfield
		        label="Product name..."
			ref="searchTerm"
			className={styles.searchBar}
		      />
		      <FABButton onClick={()=>this.handleSubmit} colored>
		        <Icon name="search"/>
		      </FABButton>
		  </form>
		  <div className={styles.spinner}>
		    {spinner}
		  </div>

		{this.props.result.results.edges.map(edge => {
		  return(
		    <Card className={styles.card} shadow={5}>
		      <CardTitle className={styles.cardTitle}>
		        {edge.node.price}
		      </CardTitle>
		      <CardText>
			{edge.node.name}
			<h4>{edge.node.url}</h4>
			<Button  onClick={()=>window.open(edge.node.url)} raised>Open Result</Button>
		      </CardText>
		    </Card>
		  );
		})}
	      </Page>
	    );
	}
	    handleSubmit(e) { 
		    e.preventDefault();
		    this.setState({showSpinner:true})		    
		    var search = this.refs.searchTerm.refs.input.value;
		    var refinedSearch = search.replace("/\ /g ","_").replace("/\'/g","");
		    console.log(this.props.relay.variables);
		    var requestString =`${config.balancer}`+ refinedSearch;
		    request(requestString, function(err,res){ 
		    });
		      this.props.relay.setVariables({ searchStr: refinedSearch,});
			 var c = 0;
		      setInterval(() => {
			 if(c <= 20){
			    c++;
		            this.props.relay.forceFetch();
			 }else{
		 	   clearInterval();
		         } 
		        },333);
	    }
}



