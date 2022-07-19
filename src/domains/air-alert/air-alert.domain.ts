import { Notification } from 'electron';
import settings from '../../settings';
import { AirAlertApiService } from '../../services/air-alert/air-alert.service';
import { states } from './air-alert.types';

export class AirAlertDomain {
	protected readonly airAlertApi: AirAlertApiService;

	constructor() {
		this.airAlertApi = new AirAlertApiService();
	}

	private showNotification(props: { title: string; body?: string }) {
		const notification = new Notification({
			title: props.title,
			...(props.body && { body: props.body }),
		});
		notification.show();
	}

	listenToAirAlerts() {
		const alertsSettings = settings.get('airAlerts');
		const state = alertsSettings.state;
		let previousAlertStatus = false;

		const stateInUkrainian = states[state as 'Kyiv'];

		const airAlertIsActiveMessage = {
			title: '🚨 Повітряна тривога',
			body: `Повітряна тривога в ${stateInUkrainian}. Якнайшвидше перейдіть у безпечне укриття!`,
		};
		const airAlertIsInactiveMessage = {
			title: `Кінець повітряної тривоги в ${stateInUkrainian}`,
		};

		if (state) {
			setInterval(() => {
				this.airAlertApi
					.getInfoAboutAirAlerts()
					.then((data) => {
						if (data) {
							const { states } = data;
							const [desiredState] = states.filter(
								(el) => el.name_en === state,
							);

							if (desiredState) {
								const actualAlertStatus = desiredState.alert;

								if (actualAlertStatus !== previousAlertStatus) {
									previousAlertStatus = actualAlertStatus;
									this.showNotification(
										actualAlertStatus
											? airAlertIsActiveMessage
											: airAlertIsInactiveMessage,
									);
								}
							}
						}
					})
					.catch((e) => {
						console.error(e);
					});
			}, 30000);
		}
	}
}
