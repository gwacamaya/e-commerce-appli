
export function commande_POST(data) {
    return fetch('http://localhost:8000/passer-commande', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
        
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response;          
          } else {
           console.log('Something went wrong');
          }
    }).catch(err => err);
    }