import React, {Component} from 'react'
import Article from './Article'
import requeteGet from '../../actions/get'
import styles from '../../styles/designs.module.css'

class Depot extends Component{

    constructor(props){
        super(props)
        this.state ={
            articlesArray : this.props.articlesArray,
            depotId: this.props.depotId,
            articles: []
            
        }
        console.log('articles:', this.state.articlesArray)
        const METHOD = ['getArticleSet', 'feedArticles', 'doUpload']
        METHOD.forEach(method => {
            this[method] = this[method].bind(this)
        });
        this.getArticleSet()
    }

    async getArticleSet(){
        const url = 'http://localhost:8000/articles/'+this.state.depotId
        const article_set = await requeteGet(url)
        if(article_set != null){
            this.setState({ articles: article_set})
            console.log('received articles from back',article_set)
        }
        
    }

    doUpload(elem, operation){       
        this.props.onUpdate(elem,operation)
    }

    feedArticles(){
        const set1 = this.state.articles, set2 = this.state.articlesArray
        const len1 = set1.length, len2 = set2.length

        if(len1 !== 0 && len2 !== 0 && len1 === len2  ){ 
           set1.sort(function (a, b) {
            var id1 = a._id 
            var id2 = b._id 
            if (id1 < id2) {
              return -1;
            }
            if (id1 > id2) {
              return 1;
            }          
            return 0;
          });

          set2.sort(function (a, b) {
            var id1 = a.articleId
            var id2 = b.articleId
            if (id1 < id2) {
              return -1;
            }
            if (id1 > id2) {
              return 1;
            }          
            return 0;
          });
          var article = []
          for(var i = 0; i<len1; i++){
            article.push({name:set1[i].nom, prix: set1[i].prixHT, qty:set2[i].qty, id:set2[i].articleId})
          }
          
          return article.map(element=>{
                    return(
                        <Article nom={element.name} 
                                 prix={element.prix}
                                 depotId={this.state.depotId}
                                 qty={element.qty}
                                 id={element.id}
                                 key={element.id}
                                 update={this.doUpload}
                        />
                    )
          })


        }else{
           // console.warn('Data not ready yet')
        }
    }

    render(){
        return(
            <div className={styles.flexWrap+' '+styles.depot}>
                {this.feedArticles()}
            </div>
        )
    }
}

export default Depot
