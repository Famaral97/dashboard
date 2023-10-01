function hondt(votesByParty, mandates) {
    let result = {}
    for (party in votesByParty) result[party] = 0
    let attributedMandates = 0

    while (attributedMandates < mandates) {
        let chosenParty = ""
        let biggestAverage = 0
        for (party in votesByParty) {
            let average = (votesByParty[party] / (result[party] + 1))
            if (average > biggestAverage) {
                chosenParty = party
                biggestAverage = average
            }
        }
        result[chosenParty]++
        attributedMandates++
    }
    return result
}