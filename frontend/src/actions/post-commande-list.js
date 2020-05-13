export function command_list_POST(data_input) {
    return fetch('http://localhost:8000/commande-list', {
        method: 'POST',
        body: JSON.stringify(data_input),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(json => {
        if(json.error){
            alert(json.error);
        }
        else {
        
            return json;
        }
    }).catch(err => err);
    }
