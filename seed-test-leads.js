const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "adybabacrm";

async function seed() {
  if (!uri) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const leadsCollection = db.collection('website_enquiries');

    const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
    const priorities = ["High", "Medium", "Low"];
    const services = ["Meta Ads", "Web Development", "SEO", "Social Media Management"];
    const names = [
      "Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", "Eve Adams",
      "Frank Castle", "Grace Hopper", "Hank Pym", "Ivy Vine", "Jack Reacher",
      "Karen Page", "Leo Fitz", "Mia Toretto", "Noah Bennett", "Olivia Pope",
      "Paul Atreides", "Quinn Fabray", "Rachel Green", "Sam Wilson", "Tony Stark"
    ];

    const testLeads = names.map((name, i) => {
      const status = statuses[i % statuses.length];
      const priority = priorities[i % priorities.length];
      const service = services[i % services.length];
      
      const lead = {
        name,
        company: `Test Company ${i + 1}`,
        email: `test${i}@example.com`,
        phone: `9198765432${i.toString().padStart(2, '0')}`,
        service,
        status,
        priority,
        leadTemperature: i % 2 === 0 ? "Hot" : "Warm",
        source: "Test Seed",
        isTest: true,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 86400000)), // Random time within last 10 days
        updatedAt: new Date(),
        events: [{
          action: "Lead Created (Test)",
          type: "System",
          performedBy: "System",
          timestamp: new Date().toISOString()
        }]
      };

      if (status !== "New") {
        lead.lastContactedAt = new Date().toISOString();
      }

      if (status === "Won") {
        lead.wonValue = Math.floor(Math.random() * 100000) + 25000;
      }

      if (i % 5 === 0) {
         // Create some overdue followups
         lead.nextFollowUpAt = new Date(Date.now() - 86400000).toISOString();
         lead.followUpStatus = "Pending";
         lead.followUpType = "Call";
      }

      return lead;
    });

    const result = await leadsCollection.insertMany(testLeads);
    console.log(`Successfully inserted ${result.insertedCount} test leads.`);

  } catch (error) {
    console.error("Error seeding leads:", error);
  } finally {
    await client.close();
  }
}

seed();
