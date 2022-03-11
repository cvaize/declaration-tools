import { SchemaResponse } from '../../src';

export const pointsSchemaResponse: SchemaResponse = {
	schema: {
		array: {
			object: {
				ID: { string: {} },
				CalendarWorkCode: { string: {} },
				Code: { string: {} },
				Name: { string: {} },
				RequestCode: { string: {} },
				RegionCode: { string: {} },
				Index: { string: {} },
				Address: { string: {} },
				Phone: { string: {} },
				EMail: { string: {} },
				WorkMode: { string: {} },
				FittingRoom: { number: {} },
				PaymentCard: { number: {} },
				PaymentType: { number: {} },
				PaymentPossible: { number: {} },
				ReceiptOrder: { number: {} },
				Latitude: { number: {} },
				Longitude: { number: {} },
				HomePage: { string: {} },
				ClosingDate: { null: {} },
				OpeningDate: { string: {} },
				CouponReceipt: { number: {} },
				DaysFreeStorage: { number: {} },
				SubAgent: { number: {} },
				DeliveryTimeFrom: { string: {} },
				DeliveryTimeTo: { string: {} },
				Carrier: { null: {}, string: {} },
				ReplicationPath: { string: {} },
				Submission: { string: {} },
				Special_Code: { string: {} },
				HowToGet: { string: {} },
				FormPostCode: { string: {} },
				FormRegion: { string: {} },
				FormCity: { string: {} },
				FormStreet: { string: {} },
				FormHouse: { string: {} },
				FormBuilding: { string: {} },
				FormOffice: { string: {} },
				FormKLADRCode: { string: {} },
				FormFIASCode: { string: {} },
				FormalizedArea: { string: {} },
				FormalizedLocality: { string: {} },
				Scale: { number: {} },
				TimeZone: { number: {} },
				Type: { number: {} },
				ReplacementLocation: { string: {} },
				MetroStation: { string: {} },
				CityFIAS: { string: {} },
				Agent: { null: {} },
			},
		},
	},
};

export default pointsSchemaResponse;
