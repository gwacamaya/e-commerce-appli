const GET_depots = fetch('http://localhost:8000/depots-names')

export default GET_depots.then(response => {return response.json()})