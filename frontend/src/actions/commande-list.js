export function commande_list_GET() {
    return fetch('http://localhost:8000/commande-list', {
        mode: "cors",
        method: "GET",
        headers: {
          "Accept": "application/json"
        }, 
        cache: "no-store"
      })
    .then(response => {
        
        if (response.status >= 200 && response.status < 300) {
            console.log("clients_GET achieved!");
            console.log(response);
          } else {
           console.log('Something went wrong');
          }
          
    }).catch(err => err);
    }