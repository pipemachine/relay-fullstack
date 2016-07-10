/* eslint-disable global-require */
import React from 'react';
import { Grid, Cell, Card, CardTitle, CardText, CardActions, Button, Textfield} from 'react-mdl';
import Page from '../Page/PageComponent';
import styles from './Feature.scss';
import request from 'superagent'

/*export default class Feature extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <Page heading='Integrated with'>
        <Grid>
          {this.props.viewer.features.edges.map(edge => {
            const imageUrl = require(`../../assets/${edge.node.name.toLowerCase()}.png`);
            return (
              <Cell col={4} key={edge.node.id}>
                <Card className={styles.card}>
                  <CardTitle expand className={styles.image} style={{ backgroundImage: `url(${imageUrl})` }} />
                  <CardActions className={styles.name}>
                    <Button colored href={edge.node.url}>{edge.node.name}</Button>
                  </CardActions>
                  <CardText className={styles.description}>
                    {edge.node.description}
                  </CardText>
                </Card>
              </Cell>
            );
          })}
        </Grid>
      </Page>
    );
  }
}*/

class Frame extends React.Component{
  static propTypes = {
    url: React.PropTypes.object.isRequired
  };
  render(){
    return(
	<iframe src={this.props.url} height="300px"> </iframe>
    );
  }
}


export default class Feature extends React.Component {
	static propTypes = {
	  result: React.PropTypes.object.isRequired
	};
	constructor(props){
	  super(props);
	  this.state = {
	    framesToShow: []
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
	handleClick(url){
	  if(this.trueCheck(this.state.framesToShow,url)){
	    this.setState({framesToShow: this.state.framesToShow.splice(this.state.framesToShow.indexOf(url),1)});
	  }else{
	    console.log(this.state.framesToShow);
	    this.setState({framesToShow:this.state.framesToShow.push(url)});
	  }
		console.log("index val for frametoshow: "+ this.trueCheck(this.state.framesToShow,url));
	}
	render() {
	    return(
	      <Page className={styles.main}>
	          <form onSubmit={this.handleSubmit.bind(this)} className={styles.searchForm}>
		     <i style={{fontSize:'24px'}} className="material-icons ">search</i>
		      <Textfield
		        label="Product name..."
			ref="searchTerm"
			className={styles.searchBar}
		      />
		  </form>
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
		    var search = this.refs.searchTerm.refs.input.value;
		    var refinedSearch = search.replace("/\ /g ","_").replace("/\'/g","");
		    console.log(this.props.relay.variables);
		    var requestString = 'http://samuelellis.me/'+ refinedSearch;
		    request(requestString, function(err,res){ 
		    });
		  //   this.refs.searchTerm.refs.input.value= '';
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



