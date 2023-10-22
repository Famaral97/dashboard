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

function addElectionResultsColumnByMethod(table, votesByParty, totalSeats, method, methodName) {
    const electionResults = method(votesByParty, totalSeats)

    for (let row of table.rows) {
        let newCell = row.insertCell(-1)
        newCell.className = `${methodName}-column`
        newCell.innerHTML = electionResults[row.cells[0].innerText] ?? 0
    }
}

function removeElectionResultsColumnByMethod(table, methodName) {
    for (let row of table.rows) {
        for (let i = 0; i < row.cells.length; i++) {
            if (row.cells[i].className === `${methodName}-column`) {
                row.deleteCell(i)
            }
        }
    }
}

function enableElectionMethod(partiesTable, votesByParty, totalSeats, method, methodName) {
    let option = document.getElementById(methodName)
        
    option.checked = false
    option.addEventListener("change", function() {
        if (this.checked) {
            removeElectionResultsColumnByMethod(partiesTable, methodName)
            addElectionResultsColumnByMethod(partiesTable, votesByParty, totalSeats, method, methodName)
        } else {
            removeElectionResultsColumnByMethod(partiesTable, methodName)
        }
    })
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

        enableElectionMethod(partiesTable, votesByParty, totalSeats, hondt, "hondt")
        enableElectionMethod(partiesTable, votesByParty, totalSeats, webster, "webster")
        enableElectionMethod(partiesTable, votesByParty, totalSeats, huntingtonHill, "huntington-hill")
    })
}