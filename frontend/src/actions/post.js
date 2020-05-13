const requetePost = function(url, data) {
    return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }    
           })   
            .then(response => {

                if (response.status >= 200 && response.status < 300){ return response.json() 
                }else {
                    console.error('request not achieved')
                    return null;
                }                
            })
            .then(data_received =>{
                    if(data_received.error){
                        console.error(data_received.error)
                        return null
                    }else{                        
                        return data_received
                    }
            }).catch(err=> { console.error(null, err)})
}

export default requetePost