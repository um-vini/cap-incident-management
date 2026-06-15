const cds = require('@sap/cds');

class AdminService extends cds.ApplicationService {
  async init() {
    // Intercept the draft creation (Draft) of the Customers entity
    this.before('NEW', 'Customers.drafts', (req) =>
      this.generateCustomerID(req),
    );

    // Ensure the logic runs if there is a direct creation without a draft
    this.before('CREATE', 'Customers', (req) => this.generateCustomerID(req));

    return super.init();
  }

  async generateCustomerID(req) {
    
    if (req.data.ID) return;

    // Connect to the Business Partner 
    const S4bupa = await cds.connect.to('API_BUSINESS_PARTNER');

    // Fetch the highest registered ID at S/4HANA 
    const externalCustomers = await S4bupa.run(
      SELECT.from('A_BusinessPartner')
        .columns('BusinessPartner')
        .orderBy('BusinessPartner desc')
        .limit(1),
    );

    let maxID = 0;
    if (externalCustomers && externalCustomers.length > 0) {
      // Get the highest ID 
      maxID = parseInt(externalCustomers[0].BusinessPartner, 10);
    }

    // Increment by 1 the highest ID found. If the CSV file is empty, start at 100000
    let nextID = maxID > 0 ? String(maxID + 1) : '100000';

    req.data.ID = nextID;
  }
}

module.exports = AdminService;