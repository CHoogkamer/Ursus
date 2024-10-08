const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

app.command('/hello', async ({ command, ack, say }) => {
    await ack();
    await say(`Hey there ${command.name}!`);
});

app.command('/test', async ({ command, ack, respond }) => {
  await ack();

  await respond(`Dit is de reactie op je slash command, ${command.user_name}!`);
});

app.message('/events', async ({ message, say, ack }) => {
    // Acknowledge the event first
    await ack();

    // Then send the response
    await say({
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'Click any of the buttons'
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Add event'
                    },
                    action_id: 'add_event_button'
                }
            }
        ]
    });
});

app.action('add_event_button', async ({ body, ack, client}) => {
    await ack();

    await client.views.open({
        trigger_id: body.trigger_id,
        view: {
            type: 'modal',
            callback_id: 'modal-identifier',
            title: {
                type: 'plain_text',
                text: 'Add event'
            },
            blocks: [
                {
                    type: 'input',
                    block_id: 'input_name',
                    label: {
                        type: 'plain_text',
                        text: 'Enter the name of the event'
                    },
                    element: {
                        type: 'plain_text_input',
                        action_id: 'input_a'
                    }
                }
            ],
            submit: {
                type: 'plain_text',
                text: 'Submit'
            }
        }
    });
});

app.view('modal-identifier', async ({ ack, body, view, client }) => {
    // Acknowledge the view_submission event
    await ack();
  
    // Do something with the input data
    const userInput = view.state.values.input_c.input_a.value;
    console.log(userInput);
  
    // Respond to the user
    await client.chat.postMessage({
      channel: body.user.id,
      text: `You entered: ${userInput}`
    });
  });
