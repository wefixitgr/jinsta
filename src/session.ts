import { IgApiClient } from 'instagram-private-api';
import { IConfig, saveSession, removeCookie } from './config';
import { solveChallenge } from './challenge'

class session {
	private ig: IgApiClient;
	private config: IConfig;

	constructor(ig: IgApiClient, config: IConfig) {
		this.ig = ig;
		this.config = config;
	}

	async login() {
		removeCookie()
		this.ig.state.generateDevice(this.config.seed);
		this.ig.request.end$.subscribe(this.saveSession.bind(this));
		solveChallenge(this.ig)
		return

		if (this.config.restore) {
			await this.ig.state.deserializeCookieJar(this.config.cookie);
			return;
		}

		await this.ig.simulate.preLoginFlow();
		await this.ig.account.login(this.config.username, this.config.password);
		this.ig.simulate.postLoginFlow(); // dont await here
	}

	async saveSession() {
		const cookies = await this.ig.state.serializeCookieJar();
		saveSession(cookies, this.config.seed);
	}
}

export default session;
