'use strict';
const stripe = require('stripe')(process.env.STRIPE_KEY)
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    createPaymentIntent: async(ctx) =>{
        const {cart} = ctx.request.body;
        let games = []
        if(!cart.length){
            ctx.response.status = 404;
            return {
                error:'no game informed'
            }
            
        }
        await Promise.all(cart.map(async (game)=>{
            const validGame = await strapi.services.game.findOne({
                id:game.id
            });
            if(validGame){
                games.push(validGame);
            }

        }))
        if(!games.length){
            return {
                erro:'No valid games founded'
            }
        }

        const total = games.reduce((acc,game)=>{
            return acc+game.price
        },0)

        if(total === 0){
            return {
                freeGames: true
            }
        }

        return {total_in_cents:(total*100),games}
    }
};
