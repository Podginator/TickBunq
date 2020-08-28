const TickTickClient = require('./lib/TickTickClient');
const BunqClient = require('./lib/BunqClient')
const { calculateRewardFromHabits } = require('./lib/rewards');

const { TICKUSERNAME, TICKPASSWORD } = process.env 

const handler = async () => { 
    const ticktickClient = await TickTickClient.createClient(TICKUSERNAME, TICKPASSWORD);

    const habits = await ticktickClient.getHabits();
    const rewardValue = calculateRewardFromHabits(habits)
    
    if (rewardValue) { 
        const bunqClient = await BunqClient.createClient();
        await bunqClient.transferMoneyToSavings(1, 'savings', 'Habit money')
    }
};

module.exports = { 
    handler
}