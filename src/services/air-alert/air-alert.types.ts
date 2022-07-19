export type AirAlertsApiResponse = {
	states: AirAlertState[];
	last_update: Date;
};

type AirAlertState = {
	id: number;
	name: string;
	name_en: string;
	alert: boolean;
	changed: Date;
};
