function divisorMethod(votesByParty, mandates, divisorCalculation) {
    let result = {}
    for (party in votesByParty) result[party] = 0
    let attributedMandates = 0

    while (attributedMandates < mandates) {
        let chosenParty = ""
        let biggestAverage = 0
        for (party in votesByParty) {
            let average = (votesByParty[party] / (divisorCalculation(result[party])))
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

function hondt(votesByParty, mandates) {
    return divisorMethod(votesByParty, mandates, (seats) => seats + 1)
}

function webster(votesByParty, mandates) {
    return divisorMethod(votesByParty, mandates, (seats) => seats + 0.5)
}