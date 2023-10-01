async function getParties() {
    const parties_url = "https://raw.githubusercontent.com/Famaral97/dashboard/master/votesdb/parties.json"

    try {
    const partyNamesResponse = await d3.json(parties_url)
    return partyNamesResponse.countries
    } catch(error) {
    console.log("couldn't get party names.")
    console.log(error)
    }
}

function generatePartyTable(countryCode, tableBodyId, partyNames) {
    d3.json(`https://raw.githubusercontent.com/Famaral97/dashboard/master/votesdb/${countryCode.toLowerCase()}.json`).then(data => {
        let partiesTable = document.getElementById(tableBodyId)
        partiesTable.innerHTML = ""
        let totalSeats = data.seatsTotal
        let votesByParty = {}
        data.partySummary.seatsByParty.map((p) => {
            let row = document.createElement("tr")

            EUParties = p.groupDistribution === null ?
                        "Sem Afilia&ccedil;&atilde;o (0 mandatos)" :
                        p.groupDistribution.reduce((acc, group) => {
                            let groupId = group.id === "NA" ? "Sem Afilia&ccedil;&atilde;o" : group.id
                            return acc.concat(`${groupId} (${group.seatsTotal} ${group.seatsTotal === 1 ? "mandato" : "mandatos"})<br>`)
                        }, "")
            
            row.insertCell(0).innerHTML = EUParties

            row.insertCell(0).innerHTML = p.votesPercent

            let partyAcronym = partyNames.find((c) => c.countryId === countryCode).candidates.find((party) => party.candidateId === p.id).candidateAcronym
            if (partyAcronym === "Other parties") partyAcronym = "Outros"
            row.insertCell(0).innerHTML = partyAcronym
            partiesTable.appendChild(row)
            if (partyAcronym !== "Outros") votesByParty[partyAcronym] = p.votesPercent
        })
        console.log(hondt(votesByParty, totalSeats))
      })
}