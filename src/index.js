const Alexa = require('alexa-sdk')
const lumen = require('lumen')
const APP_ID = ''

const languageStrings = {
    'de-DE': {
        'translation': {
            'SKILL_NAME': 'Lumen',
            'INTRO_MESSAGE': 'Im Filmtheater Lumen läuft heute',
            'EXTRO_MESSAGE': 'Viel Spaß im Kino.',
            'HELP_MESSAGE': "Ich sage Dir was heute im Filmtheater Lumen in Düren läuft.",
            'HELP_REPROMPT': "Was möchtest Du wissen?",
            'STOP_MESSAGE': 'Tschüss'
        }
    }
}

const createSpeechContent = (env, program) => {
    const content = Object.keys(program).reduce((result, movie) => {
        const times = program[movie].times
        const allTimes = times.map(time => `${time} Uhr  <break time="500ms"/> `).join(' und um ')
        result += `der Film ${movie} um ${allTimes} <break time="500ms"/>`
        return result
    }, '')

    return env.t('INTRO_MESSAGE') + ' <break time="1000ms"/> '
        + content + ' <break time="1000ms"/> '
        + env.t('EXTRO_MESSAGE')
}

const createCardContent = (env, program) => {
    const content = Object.keys(program).reduce((result, movie) => {
        const times = program[movie].times
        const allTimes = times.map(time => `${time} Uhr `).join(',')
        result += `${movie} um ${allTimes}\n`
        return result
    }, '')

    return env.t('INTRO_MESSAGE') + ':\n'
        + content + '\n'
        + env.t('EXTRO_MESSAGE')
}

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context)
    alexa.APP_ID = APP_ID
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings
    alexa.registerHandlers(handlers)
    alexa.execute()
}

const handlers = {
    'LaunchRequest': function () {
        this.emit('RunningSoon')
    },

    'RunningSoon': function () {
        lumen.runningSoon(program => {
            const speechContent = createSpeechContent(this, program)
            const cardContent = createCardContent(this, program)
            this.emit(':tellWithCard', speechContent, this.t('SKILL_NAME'), cardContent)
        })
    },

    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t(HELP_MESSAGE)
        const reprompt = this.t(HELP_REPROMPT)
        this.emit(':ask', speechOutput, reprompt)
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t(STOP_MESSAGE))
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t(STOP_MESSAGE))
    },

    'Unhandled': function () {
        const speechOutput = this.t('HELP_MESSAGE')
        const reprompt = this.t('HELP_REPROMPT')
        this.emit(':ask', speechOutput, reprompt)
    }
}
