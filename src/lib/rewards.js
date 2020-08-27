const calculateRewardFromHabits = (habits) => { 
    const checkInStamp = getTickTickFormattedDateStamp()

    // This is a little inefficient, but will be fast enough due to the habits being minimal. 
    const completedHabits = habits.filter(habit => { 
        return habit.checkIns.find(check => check.checkinStamp === checkInStamp)
    })

    // We have completed 100% of the habits. 
    if (completedHabits.length === habits.length) { 
        return 20;
    }

    // We have completed half, or just under half of the habits today. 
    if (completedHabits.length >= Math.floor(habits.length / 2)) { 
        return 10;
    }

    // We have at least completed one habit, and that deserves a small reward right!
    if (completedHabits.length > 1) { 
        return 5; 
    }

    // Womp, womp.
    return 0;
}

// Tick tick generates their date stamp as YYYYMMDD as a number 
const getTickTickFormattedDateStamp = () => { 
    const today = new Date() 
    return parseInt(`${today.getFullYear()}${('0' + (today.getMonth() + 1)).slice(-2)}${today.getDate()}`)
}

module.exports = { calculateRewardFromHabits };