export function add_Depot(data_input) {
    return fetch('http://localhost:8000/addDepot', {
        method: 'POST',
        body: JSON.stringify(data_input),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(json => {
        //console.log(json);
        if(json.error){
            alert(json.error);
            console.error(json.error)
            return json.error
        }
        else {
        
            return json;
        
        }
    }).catch(err => err);
    }
