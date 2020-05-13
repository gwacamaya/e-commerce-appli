import React, {Component} from 'react'
import styles from '../../styles/designs.module.css'


class Article extends Component{

    constructor(props){
        super(props)
        this.state = {
            nom: this.props.nom,
            prix: this.props.prix,
            depotId: this.props.depotId,
            id: this.props.id,
            qty: this.props.qty,
            quantity: 0,
            available:''

        }
        this.state.available =this.responsiveQty(0, this.state.qty)
        const METHOD = ['add', 'sous', 'handleUpdate', 'responsiveQty']
        METHOD.forEach(method=>{
            this[method] = this[method].bind(this)
        })
    }

    add(){
        
        if(this.state.quantity < this.props.qty){
            const q = this.state.quantity + 1, n = this.state.nom, p = this.state.prix, id = this.state.id, depotId = this.state.depotId
            this.setState({ quantity: q})
            var a=this.responsiveQty(q, this.state.qty)
            this.setState({available: a})
            this.props.update({nom:n, id:id, prix:p, qty:q, depotId: depotId}, true)
            
            
            
        }else {
            console.warn('maximum of articles en stock achieved')
        }
        
    }

    sous(){
        if(this.state.quantity > 0){
            const q = this.state.quantity - 1, n = this.state.nom, p = this.state.prix, id = this.state.id
            this.setState({ quantity: q})
            var a=this.responsiveQty(q, this.state.qty)
            this.setState({available: a})
            this.props.update({nom:n, id:id, prix:p, qty:q}, false)
        }
    }

    handleUpdate(){
        
    }

    responsiveQty(quantityClient, quantityDepot){
        var available ='', qtyAvailable = quantityDepot - quantityClient;
        if (qtyAvailable > 1 ){
            available += qtyAvailable +" disponibles";
            return(available)
        }
        else if (qtyAvailable === 1){
            available += "1 disponible";
            return(available)
        }
        else {
            return("Aucun disponible")
        }
    }
    render(){
        return(
            <div className={styles.card+' '+styles.article}>
               
                 <p><strong>Nom: </strong>{this.state.nom} </p>
                <label><strong>Prix: </strong>{this.state.prix} €</label>
                <p><strong>Ajouter au panier: </strong> {this.state.quantity} ({this.state.available})</p>
                <button onClick={this.add}> + </button><button onClick={this.sous}> - </button>

            </div>
        )
    }
}

export default Article;