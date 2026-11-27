const Alexa = require('ask-sdk-core');
const BibleService = require('./bibleService');

const bibleService = new BibleService();

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = 'Welcome to Bible Reader! I can read verses, passages, chapters, and famous stories in KJV, NIV, NLT, NASB, NKJV, and ASV. Try saying "read John chapter 3 verse 16", "read the story of David and Goliath", or say "help" for more options. What would you like to hear?';
    
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const ReadVerseIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadVerseIntent';
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const book = slots.book && slots.book.value;
    const chapter = slots.chapter && slots.chapter.value;
    const verse = slots.verse && slots.verse.value;
    const version = (slots.version && slots.version.value) || getUserPreferredVersion(handlerInput);

    if (!book || !chapter || !verse) {
      return handlerInput.responseBuilder
        .speak('I need a book, chapter, and verse number. For example, say "read John 3:16".')
        .reprompt('Please provide a complete Bible reference.')
        .getResponse();
    }

    try {
      const result = await bibleService.getVerse(book, chapter, verse, version);
      const speakOutput = `Here is ${result.reference} from the ${result.version}: ${result.text}`;
      
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    } catch (error) {
      return handlerInput.responseBuilder
        .speak('Sorry, I couldn\'t find that verse. Please check your reference and try again.')
        .reprompt('What verse would you like me to read?')
        .getResponse();
    }
  }
};

const ReadStoryIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadStoryIntent';
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const storySlot = slots.story;
    const version = (slots.version && slots.version.value) || getUserPreferredVersion(handlerInput);

    // Use resolved canonical value if available, fall back to spoken value
    var storyQuery = storySlot && storySlot.value;
    if (storySlot && storySlot.resolutions &&
        storySlot.resolutions.resolutionsPerAuthority &&
        storySlot.resolutions.resolutionsPerAuthority[0].values) {
      storyQuery = storySlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }

    if (!storyQuery) {
      return handlerInput.responseBuilder
        .speak('What story would you like me to read? Try saying "read the story of David and Goliath" or "read the Christmas story".')
        .reprompt('What story would you like to hear?')
        .getResponse();
    }

    const story = bibleService.findStory(storyQuery);

    if (!story) {
      console.log('UNKNOWN_STORY_REQUEST: ' + storyQuery);
      return handlerInput.responseBuilder
        .speak('I don\'t have the story of ' + storyQuery + ' yet, but I\'ve noted your request and will try to add it soon. Try asking for stories like David and Goliath, the Prodigal Son, or Noah\'s Ark.')
        .reprompt('What other story would you like to hear?')
        .getResponse();
    }

    try {
      const result = await bibleService.getStory(story.ref, story.title, version);
      const speakOutput = 'Here is ' + result.reference + ' from the ' + result.version + '. ' + result.text;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    } catch (error) {
      return handlerInput.responseBuilder
        .speak('Sorry, I had trouble reading that story. Please try again.')
        .reprompt('What story would you like to hear?')
        .getResponse();
    }
  }
};

const ReadPassageIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadPassageIntent';
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const book = slots.book && slots.book.value;
    const chapter = slots.chapter && slots.chapter.value;
    const startVerse = slots.startVerse && slots.startVerse.value;
    const endVerse = slots.endVerse && slots.endVerse.value;
    const version = (slots.version && slots.version.value) || getUserPreferredVersion(handlerInput);

    if (!book || !chapter || !startVerse || !endVerse) {
      return handlerInput.responseBuilder
        .speak('I need a book, chapter, and verse range. For example, say "read John 3:16 to 18".')
        .reprompt('Please provide a complete Bible passage reference.')
        .getResponse();
    }

    try {
      const result = await bibleService.getPassage(book, chapter, startVerse, endVerse, version);
      const speakOutput = `Here is ${result.reference} from the ${result.version}: ${result.text}`;
      
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    } catch (error) {
      return handlerInput.responseBuilder
        .speak('Sorry, I couldn\'t find that passage. Please check your reference and try again.')
        .reprompt('What passage would you like me to read?')
        .getResponse();
    }
  }
};

const ReadChapterIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadChapterIntent';
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const book = slots.book && slots.book.value;
    const chapter = slots.chapter && slots.chapter.value;
    const version = (slots.version && slots.version.value) || getUserPreferredVersion(handlerInput);

    if (!book || !chapter) {
      return handlerInput.responseBuilder
        .speak('I need a book and chapter number. For example, say "read Psalm 23".')
        .reprompt('Please provide a book and chapter.')
        .getResponse();
    }

    try {
      const result = await bibleService.getChapter(book, chapter, version);
      const speakOutput = 'Here is ' + result.reference + ' from the ' + result.version + '. ' + result.text;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    } catch (error) {
      return handlerInput.responseBuilder
        .speak('Sorry, I couldn\'t find that chapter. Please check your reference and try again.')
        .reprompt('What chapter would you like me to read?')
        .getResponse();
    }
  }
};

const SetBibleVersionIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetBibleVersionIntent';
  },
  handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const version = slots.version && slots.version.value;

    if (!version || !bibleService.isValidVersion(version)) {
      const availableVersions = bibleService.getAvailableVersions().join(', ');
      return handlerInput.responseBuilder
        .speak(`Please choose from these available versions: ${availableVersions}`)
        .reprompt('Which Bible version would you like to use?')
        .getResponse();
    }

    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.preferredVersion = version.toUpperCase();
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(`I've set your Bible version to ${version.toUpperCase()}. What would you like me to read?`)
      .reprompt('What verse or passage would you like me to read?')
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'I can read Bible verses, passages, chapters, and famous stories in six translations: King James, NIV, NLT, NASB, New King James, and American Standard. Try saying "read John chapter 3 verse 16 in NIV", "read the story of David and Goliath", or "read the Christmas story". You can also set your version by saying "use NLT". What would you like me to read?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = 'God bless you!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${JSON.stringify(error)}`);
    const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

function getUserPreferredVersion(handlerInput) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  return sessionAttributes.preferredVersion || 'KJV';
}

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    ReadStoryIntentHandler,
    ReadVerseIntentHandler,
    ReadPassageIntentHandler,
    ReadChapterIntentHandler,
    SetBibleVersionIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();