const axios = require('axios')

class TickTickClient { 
    
    constructor(token) { 
        this.token = token 
    }

    // There is no token based API for TickTick unfortunately. 
    // I have to fake a cookie based on a typical user/password login. 
    static async createClient(username, password) { 
        const { token }  = await axios.post('https://api.ticktick.com/api/v2/user/signon?wc=true&remember=true', { username, password}).then(({data}) => data)
        return new TickTickClient(token)
    }

    // Habits are returned as a list of Habit ID, their Name, and how many times they've been accomplished. 
    getHabits() { 
        return axios.get(
            'https://api.ticktick.com/api/v2/habits', 
            { 
                headers: { 
                    Cookie: `t=${this.token};`
                }
            }
        )
        .then(({data}) => data)
        .then(this._mapToHabit)
        .then(this._combineHabbitAndCheckins.bind(this))
    }

    // Map it to just the id and the name
    _mapToHabit(rawHabits) { 
        return rawHabits.map(({id, name}) => ({ id, name }))
    }

    // Get all the habits and combine them with their 
    _combineHabbitAndCheckins(habits) { 
        const ids = habits.map(habit => habit.id);;
        const queryParams = ids.map(id => `habitIds=${id}`).join('&');
        return axios.get(
            `https://api.ticktick.com/api/v2/habitCheckins?${queryParams}`,
            { 
                headers: { 
                    Cookie: `t=${this.token};`
                }
            }
        )
        .then(({data}) => data)
        .then(this._addCheckinToHabits(habits))
    }

    _addCheckinToHabits(habits) { 
        return ({checkins}) => { 
            return habits.map(habit => ({ 
                ...habit,
                checkIns: checkins[habit.id] || []  
            }));
        }
    }
}

module.exports = TickTickClient