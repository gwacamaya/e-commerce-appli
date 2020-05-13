
import React, {Component} from 'react';
import {command_list_POST} from '../../actions/post-commande-list';
import requeteGet from '../../actions/get'
import styles from '../../styles/designs.module.css'
import Depot from './Depot'
import requetePost from '../../actions/post';

class Customer extends Component{  

  constructor(props){
    super(props);  
    const METHOD =['posterCommande','showCommands', 'renderTableData', 'feedDepots', 'feedCatalog', 'handleCommande', 'feedPanier'] 
    METHOD.forEach(method =>{
      this[method] =this[method].bind(this)
    }) 
    this.state = {
        table: [],
        show_table : false,
        depots: [],
        commandes: [],
        total: 0
    }
    this.feedDepots()   
  }

  logOut(){    
    sessionStorage.clear();
    window.location.reload();
    document.location.assign('/')
  } 
 
  async posterCommande(){
    if(this.state.commandes.length === 0){
      alert("\nAucun artcile à envoyer !\n")
    }
    else{
      console.log('A commanda in the way...');
      const url = 'http://localhost:8000/passer-commande'   
      let current_token = JSON.parse(sessionStorage.getItem('jwtToken'));
      let result= await requetePost(url, {current_token,commandes:this.state.commandes, total:this.state.total});
      if(result){ 
          console.log('POST Successful', result);
          alert('Thanks for buying with us')  
          document.location.reload()            
      }
       else { console.log('Something went wrong');
                alert('Something went wrong...');
                
            }}
  } 
  
  async showCommands(){           
    let current_token = JSON.parse(sessionStorage.getItem('jwtToken'))
    let result = await command_list_POST(current_token)
    console.log('commandes:',result)   
    this.setState({ table: result, show_table: true}) 
       
  }



  async feedDepots(){
    const url = 'http://localhost:8000/depots'
    const depots_received = await requeteGet(url)    
    if(depots_received != null){
      this.setState({depots: depots_received })
      console.log('Depots received', depots_received)
    }
  }

  feedCatalog(){
    
    if(this.state.depots.length !== 0){
      const depotClass = styles.card+' '+styles.flexWrap
      return this.state.depots.map((depot_)=>{
                return(
                    <div key={depot_._id}>
                        <h2>{depot_.name}</h2>
                        <div className={depotClass}>
                          <Depot  articlesArray={depot_.articleStock} 
                                  depotId={depot_._id}
                                  onUpdate={this.handleCommande}
                          />
                        </div>                    
                    </div> 
                )
              })
            }    
  } 

  handleCommande(truc, isAjout){
    var commandes = this.state.commandes
    var cont = 0;
    if(isAjout){
      for(let i = 0; i<commandes.length; i++){
        if(commandes[i].nom === truc.nom){
          commandes[i] = truc;
        }else{
          cont++;
        }
      }
      if(cont===commandes.length){commandes.push(truc)}
    }else{
         var cont2 = -1;
         for(let i=0;i<commandes.length;i++){
              if(commandes[i].nom===truc.nom){
                   commandes[i].qty--;  
                  if(commandes[i].qty===0){
                    commandes.splice(i, 1);
                    cont2 = i;
                  }              
              }          
          }          
        }   
     
     
    this.setState({ commandes: commandes })

        
    var tot = this.state.commandes.map((x)=>{
      return x.qty*x.prix
      })

  var tt = tot.reduce((a,b)=> a+b,0)
  this.setState({total:tt})
  }

  feedPanier(){
    if(this.state.commandes.length=== 0){
      return(<div>
        <p><strong>Aucun article séletionné</strong></p>
      </div>)
    }
    else{
      return this.state.commandes.map(element=>{
              return(
                <div key={element.id}>
                  <p><strong>Product:</strong>  {element.nom} x{element.qty} = {element.qty*element.prix} € </p>
                  <br/>
                </div>
              )
      })
  }
  }


  renderTableData(){
    if(this.state.show_table){
      
      return this.state.table.map((commande, index)=>{       
          const {_id, datecommande, total, articles} = commande
          
          return (
            <tr key={index}>
              <td>{index+1}</td>
              <td style={{width:"30px"}}>{_id}</td>
              <td>
                <ul>
                  {
                    articles.map(x=>{
                    return (<li key={x.id}> 
                                    <strong><em>nom: </em></strong> {x.nom} <br/> 
                                    <strong><em>quantity: </em></strong>{x.qty} <br/> 
                                    <strong><em>prix: </em> </strong> {x.prix} €</li>)
                    })
                  }
                  </ul>
              </td>
              <td>{datecommande}</td>
              <td>{total} €</td>
              
            </tr>
          )
      })
    }
  }

  render(){    
    const parentClass = styles.parent+' '+styles.flexWrap
    const catalogClass = styles.card+' '+styles.catalog
    const panierClass = styles.card+' '+styles.panierWidth
    
   
   return(
     <div> 
          <button onClick={this.logOut}>Log-out!</button>   
          <div className={parentClass}>

            <div className={catalogClass}>  
            <h1>CATALOGUE</h1>             
                 {this.feedCatalog()}                         
            </div>
            
            <div className={panierClass}>

                <div className={styles.card}>
                  <h2>Panier </h2>
                  {this.feedPanier()}
                  
                  <button onClick={this.posterCommande }>Commander!</button> 
                  <hr/>
                  <p><strong>Total: {this.state.total} € </strong></p>
                </div>
                       
                <button onClick={this.showCommands }>show my commands</button>    
                <div >
                  <table border='1' id='commandes'>
                  
              
                    
                    <tbody >
                      <tr><th width="15px" text-align='center'>N°</th><th width="50px"> Command Number </th><th> Articles </th><th width="50px"> Command Date </th><th>Total</th></tr>                            
                      {this.renderTableData()}
                    </tbody>
                  </table>
                </div> 

            </div> 

          </div>
       
     </div>
     )          
  }
}
export default Customer;

