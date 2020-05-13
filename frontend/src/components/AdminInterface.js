import React, { Component } from 'react';
import { add_Item } from '../actions/add-item';
import GET_depots from '../actions/get-depots-names'
import { add_Depot } from '../actions/add-depot';

class AdminInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article: {
                nom: "",
                prix: 0,
                qty: 0,
                dep_names: [],
                dep_selected: ''
            }, depot: {
                nom: "",
            }
        }
        const method = [
            'handleArticleSubmit', 'handleDepotSubmit', 'handleNameArticleChange',
             'handlePriceChange', 'handleQtityChange', 'handleNameDepotChange',
              'showDepots', 'handle_add_article'
        ]
        method.forEach(element => {
            this[element] = this[element].bind(this)
        })
        this.loadDepNames()
    }

    logOut() {
        sessionStorage.clear();
        window.location.reload();
        document.location.assign('/')
    }
    handleNameDepotChange(e) {
        this.setState({ depot: { ...this.state.depot,nom: e.target.value } })
    }
    handleNameArticleChange(e) {
        this.setState({ article: { ...this.state.article,nom: e.target.value } })
        console.log(this.state)
    }
    handlePriceChange(e) {
        this.setState({ article: { ...this.state.article,prix: e.target.value } })
    }
    handleQtityChange(e) {
        this.setState({ article: { ...this.state.article,qty: e.target.value } })
    }

    async handleArticleSubmit(e) {
        
        let current_token = JSON.parse(sessionStorage.getItem('jwtToken'));
        let result = await add_Item({ ...this.state.article, ...current_token });
        /**Avec l'operateur spread ... (trois points), on peut cloner des objects */
        console.log(result)
        if(result.res==='ok'){
            alert('Article added')
            document.location.reload()            
        }
    }
    async handleDepotSubmit(e) {
        let current_token = JSON.parse(sessionStorage.getItem('jwtToken'));
        let result = await add_Depot({ ...this.state.depot, ...current_token });
        console.log(result)
        if(result.res==='ok'){
            alert('Depot added')
            document.location.reload()
        }
    }

    async loadDepNames() {
        var deps = await GET_depots
        this.setState({ article: { ...this.state.article,dep_names: deps, dep_selected: deps[0] } })//{ dep_names: deps, dep_selected: deps[0] })
    }

    showDepots() {
        console.log(this.state.article.dep_names)
        return this.state.article.dep_names.map(dep_name => {
            return (<option value={dep_name} key={dep_name}>{dep_name}</option>)
        })
    }

    handle_add_article(event) {
        this.setState({ article:{...this.state.article,dep_selected: event.target.value }})
        console.log(event.target.value)
    }

    render() {
        const styles = { border: '1px solid black', marginBottom: '1em', padding: '1em', borderRadius: '0.5em' }
        return (
            <div >

                <div style={{ padding: '1em', align: 'right' }}><button onClick={this.logOut}>Log-out!</button></div>

                <div style={styles}>
                    <h3>Ajouter un nouvel article</h3>
                    <form>
                        <label>Depot: </label>
                        <select name="dropdown" onChange={this.handle_add_article}>
                            {this.showDepots()}
                        </select> <br />
                        <label>Nom de l'article: </label>
                        <input type="text" value={this.state.article.nom} onChange={this.handleNameArticleChange} /><br />
                        <label>Prix: </label>
                        <input type="number" min="0" value={this.state.article.prix} onChange={this.handlePriceChange} /><br />
                        <label>Quantité </label>
                        <input type="number" min="0" value={this.state.article.qty} onChange={this.handleQtityChange} /><br />
                        <input type="button" value="Ajouter un article" onClick={this.handleArticleSubmit} />
                    </form>

                </div>

                <div style={styles}>
                    <h3>Ajouter un dépôt</h3>
                    <form>
                        <label>Nom du dépôt: </label>
                        <input type="text" value={this.state.depot.nom} onChange={this.handleNameDepotChange} /><br />
                        <input type="button" value="Ajouter un dépôt" onClick={this.handleDepotSubmit} />
                    </form>
                </div>

                

            </div>
        );

    }
}

export default AdminInterface;
