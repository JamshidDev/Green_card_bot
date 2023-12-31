const { Bot, session, MemorySessionStorage, Keyboard, InlineKeyboard, InputFile, InputMediaDocument, InputMediaBuilder } = require("grammy");

require('dotenv').config()
const Database = require("./db");
const customLogger = require("./config/customLogger");
const { check_user,register_user, remove_user, set_user_lang } = require("./controllers/userController");



const client_bot = require("./modules/clientModules");
const {config_bot} = require("./modules/configModules")

const bot_token = process.env.BOT_TOKEN;







const bot = new Bot(bot_token);

bot.use(config_bot)

bot.use(client_bot)


bot.chatType("private").use(async(ctx, next)=>{
    let user = await check_user(ctx.from?.id);
    if(user){
        await ctx.i18n.setLocale(user.lang);
    }
    await ctx.conversation.enter("menu_conversation");
    next()
})


bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const message = err.error;
    customLogger.log({
        level: 'error',
        message: message
    });
});



bot.start();