const TelegramApi = require ('node-telegram-bot-api')

const token = '6270434293:AAGdUxdLWZ9e1VmV76MCVezl097xP18gPqw'

const {gameOptions, againOptions} = require('./options')

const bot = new TelegramApi (token, {polling: true})

const chats = {}



const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 1 до 9, а ты попытаешься его угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands ([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Тебя зовут'},
        {command: '/game', description: 'Сыграть в игру'},
    ])
    
    
    bot.on('message', async msg =>{
        const chatId = msg.chat.id;
        const text = msg.text;
    
    
        if (text === '/start'){
            await bot.sendSticker(chatId, 'https://www.gstatic.com/webp/gallery/1.sm.webp')
            return bot.sendMessage(chatId, `Привет! Это бот Valdislavius!`)
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        if (text === 'расскажи шутку') {
            return bot.sendMessage(chatId, `Разговаривают две блондинки:
            - Я сегодня тест на беременность сдала.
            - Сложные вопросы были?`)
        }
        return bot.sendMessage(chatId, 'Кажется, я тебя не понял( попробуй использовать другую команду')
    
    })

    bot.on ('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал( Бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()