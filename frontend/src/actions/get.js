const requeteGet = function(url) {return fetch(url).then(response => {
                        if (response.status >= 200 && response.status < 300){ return response.json() 
                        }else {
                            console.error('request not achieved')
                            return null;
                        } 
}).then(data_received =>{
    if(data_received.error){
        console.error(data_received.error)
        return null
    }else{
        
        return data_received
    }
}).catch(err=> { console.error(null, err)})
}

export default requeteGet


