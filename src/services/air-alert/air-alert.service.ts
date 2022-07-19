import ErrorsHandler from '../../errors/errors.module';
import { axiosInstance } from '../../shared/axios';
import { AirAlertsApiResponse } from './air-alert.types';
import settings from '../../settings';
import { ErrorStructure } from '../../errors/errors.types';

export class AirAlertApiService {
	protected errorsHandler: ErrorsHandler;

	constructor() {
		this.errorsHandler = new ErrorsHandler();
	}

	async getInfoAboutAirAlerts(): Promise<AirAlertsApiResponse | null> {
		const { data } = await axiosInstance
			.get<unknown, { data: AirAlertsApiResponse }>('/air-alerts')
			.catch(() => {
				return null;
			});

		if (!data) {
			const errors = settings.get('errorsStorage') as ErrorStructure[];

			const airAlertError = errors.filter(
				(el) => el.environment === 'Air Alerts',
			);

			if (airAlertError.length === 0) {
				this.errorsHandler.handleError({
					environment: 'Air alerts',
					date: new Date(),
					trace: null,
					message: `The service that provides us with
										information about air alerts in Ukraine
                    has stopped responding, we are aware of
                    this and are doing our best to fix it.`,
				});
			}

			return null;
		}

		return data;
	}
}
