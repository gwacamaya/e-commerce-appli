export function login_POST(data) {
    return fetch('http://localhost:8000/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(json => {
        if(json.error){
            alert(json.error);
        }
        else {
        let data = {
            ClientName: json.username,
            token: json.token,
        }
        sessionStorage.setItem('jwtToken', JSON.stringify(data));
    }
    }).catch(err => err);
}
