/* eslint-disable */
import { getMongoClient } from "./mongodb";

export interface AnalyticsSnapshot {
  timestamp: Date;
  businessHealth: {
    team: "Healthy" | "Needs Attention" | "Critical";
    pipeline: "Healthy" | "Needs Attention" | "Critical";
    sla: "Excellent" | "Good" | "Poor";
  };
  teamScorecards: Array<{
    id: string;
    name: string;
    callsMade: number;
    wins: number;
    winRate: number;
    followUpRate: number;
    slaCompliance: number;
    trend: { wins: number; calls: number };
  }>;
  pipeline: {
    new: number;
    contacted: number;
    interested: number;
    proposal: number;
    won: number;
  };
  sourceROI: Array<{
    source: string;
    leads: number;
    won: number;
    conversion: number;
    revenue: number;
  }>;
  goals: {
    monthlyWins: number;
    monthlyGoal: number;
    dailyCalls: number;
    dailyGoal: number;
  };
  recommendations: string[];
}

export class AnalyticsService {
  private static CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  static async getDashboardMetrics(forceRefresh = false): Promise<AnalyticsSnapshot> {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");
    const snapshots = db.collection("analytics_snapshots");

    if (!forceRefresh) {
      const latest = await snapshots.findOne({}, { sort: { timestamp: -1 } });
      if (latest && Date.now() - latest.timestamp.getTime() < this.CACHE_TTL_MS) {
        return latest as unknown as AnalyticsSnapshot;
      }
    }

    // Compute fresh metrics
    const snapshot = await this.computeMetrics(db);
    
    // Save snapshot async (don't block)
    snapshots.insertOne(snapshot).catch(console.error);
    
    return snapshot;
  }

  private static async computeMetrics(db: any): Promise<AnalyticsSnapshot> {
    const collection = db.collection("website_enquiries");
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // 1. Pipeline Funnel
    const pipelineStats = await collection.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]).toArray();
    
    const pipeMap = Object.fromEntries(pipelineStats.map((s: any) => [s._id, s.count]));
    const pipeline = {
      new: pipeMap["New"] || 0,
      contacted: pipeMap["Contacted"] || 0,
      interested: pipeMap["Qualified"] || 0, // Assuming Qualified = Interested
      proposal: pipeMap["Proposal Sent"] || 0,
      won: pipeMap["Won"] || 0,
    };

    // 2. Source ROI
    const sourceStats = await collection.aggregate([
      { 
        $group: { 
          _id: "$source", 
          leads: { $sum: 1 }, 
          won: { $sum: { $cond: [{ $eq: ["$status", "Won"] }, 1, 0] } },
          revenue: { $sum: { $cond: [{ $eq: ["$status", "Won"] }, { $ifNull: ["$wonValue", 0] }, 0] } }
        } 
      }
    ]).toArray();
    
    const sourceROI = sourceStats.map((s: any) => ({
      source: s._id || "Unknown",
      leads: s.leads,
      won: s.won,
      conversion: s.leads > 0 ? (s.won / s.leads) * 100 : 0,
      revenue: s.revenue
    })).sort((a: any, b: any) => b.revenue - a.revenue);

    // 3. Team Scorecards
    // We fetch users to map IDs to names
    const users = await db.collection("admin_users").find({ role: "employee" }).toArray();
    
    // Aggregate wins this month per employee
    const monthlyWins = await collection.aggregate([
      { $match: { status: "Won", closedAt: { $gte: startOfMonth } } },
      { $group: { _id: "$assignedTo", wins: { $sum: 1 } } }
    ]).toArray();
    
    // Aggregate calls today per employee from events
    const todayCalls = await collection.aggregate([
      { $match: { "events.type": "contact", "events.timestamp": { $gte: startOfToday } } },
      { $unwind: "$events" },
      { $match: { "events.type": "contact", "events.timestamp": { $gte: startOfToday } } },
      { $group: { _id: "$events.performedBy", calls: { $sum: 1 } } } // performedBy is usually the Name, not ID
    ]).toArray();

    // Mapping name to ID is tricky if events use Name. We will try our best.
    const scorecards = users.map((u: any) => {
      const wins = monthlyWins.find((w: any) => w._id === u._id.toString())?.wins || 0;
      const calls = todayCalls.find((c: any) => c._id === u.name)?.calls || 0;
      
      return {
        id: u._id.toString(),
        name: u.name,
        callsMade: calls,
        wins: wins,
        winRate: 20, // Mock for now until we build robust history
        followUpRate: 85 + Math.floor(Math.random() * 10), // Mocked for demonstration
        slaCompliance: 90 + Math.floor(Math.random() * 10), // Mocked
        trend: { wins: 2, calls: 5 } // vs last period
      };
    });

    // 4. Goals
    const totalWinsThisMonth = monthlyWins.reduce((sum: number, w: any) => sum + w.wins, 0);
    const totalCallsToday = todayCalls.reduce((sum: number, c: any) => sum + c.calls, 0);
    
    const goals = {
      monthlyWins: totalWinsThisMonth,
      monthlyGoal: 100, // Configurable later
      dailyCalls: totalCallsToday,
      dailyGoal: 100
    };

    // 5. Business Health & Recommendations
    let teamHealth: any = "Healthy";
    if (scorecards.some((s: any) => s.followUpRate < 80)) teamHealth = "Needs Attention";
    
    let pipeHealth: any = "Healthy";
    if (pipeline.new > 50) pipeHealth = "Needs Attention";
    
    const recommendations = [];
    if (pipeline.new > 30) recommendations.push("High volume of New leads. Consider assigning to available reps.");
    if (sourceROI.length > 0 && sourceROI[0].conversion > 20) recommendations.push(`\${sourceROI[0].source} is converting well. Focus efforts here.`);
    
    // Add SLA breach warnings
    const breached = await collection.countDocuments({ status: "New", createdAt: { $lt: new Date(Date.now() - 8 * 3600000) } });
    if (breached > 0) recommendations.push(`\${breached} new leads have breached the 8-hour SLA.`);

    return {
      timestamp: now,
      businessHealth: {
        team: teamHealth,
        pipeline: pipeHealth,
        sla: breached > 0 ? "Poor" : "Excellent"
      },
      teamScorecards: scorecards,
      pipeline,
      sourceROI,
      goals,
      recommendations
    };
  }
}
