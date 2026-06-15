using {sap.capire.incidents as my} from '../db/schema';

/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 */
service ProcessorService {
    entity Incidents as
        projection on my.Incidents {
            *,
            customer.ID || ' - ' || urgency.descr as customerUrgency : String,
        };

    @readonly
    entity Customers as projection on my.Customers;
}

annotate ProcessorService.Incidents with @odata.draft.enabled;
annotate ProcessorService with @(requires: 'support');
