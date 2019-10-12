import { IgCheckpointError } from 'instagram-private-api';
// import Bluebird = require('bluebird');
// import inquirer = require('inquirer');
import Bluebird from 'bluebird';
import inquirer from 'inquirer';

export function solveChallenge(igSession : any) {
  (async () => {
    var ig = igSession
    Bluebird.try(async () => {
      const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
      console.log(auth);
    }).catch(IgCheckpointError, async () => {
      console.log("checkpoint info: "); // Challenge info here
      console.log(ig.state.checkpoint); // Checkpoint info here
      // Verification method. Phone number = 0, email = 1
      await ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
      console.log("challenge info: "); // Challenge info here
      console.log(ig.state.checkpoint); // Challenge info here
      const { code } = await inquirer.prompt([
        {
          type: 'input',
          name: 'code',
          message: 'Enter code',
        },
      ]);
      console.log(await ig.challenge.sendSecurityCode(code));
    });
  })();
}
