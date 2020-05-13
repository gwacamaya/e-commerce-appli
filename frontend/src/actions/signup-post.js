
export function signup_POST(data) {
    return fetch('http://localhost:8000/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {

            return response;
        } else if (response.status === 501) {
            return "alreadyexists"
        } else {
            console.log('Something went wrong');
            document.location.assign('/customer')
        }
    }).catch(err => err);
}