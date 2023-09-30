async function getParties() {
    const parties_url = "https://raw.githubusercontent.com/Famaral97/dashboard/master/votesdb/parties.json"

    try {
    const partyNamesResponse = await d3.json(parties_url)
    console.log(partyNamesResponse.countries)
    return partyNamesResponse.countries
    } catch(error) {
    console.log("couldn't get party names.")
    console.log(error)
    }
}