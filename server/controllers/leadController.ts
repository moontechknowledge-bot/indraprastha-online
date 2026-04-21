import { Response } from 'express';
import { query, isValidUUID } from '../lib/db';

export const trackLead = async (req: any, res: Response) => {
  const { business_id, type } = req.body;

  try {
    let resolvedId = business_id;
    if (!isValidUUID(business_id)) {
      const [biz] = await query('SELECT id FROM businesses WHERE slug = $1', [business_id]);
      if (!biz) return res.status(404).json({ error: "Business not found" });
      resolvedId = biz.id;
    }

    if (!['call', 'whatsapp'].includes(type)) {
      return res.status(400).json({ error: 'Invalid lead type' });
    }

    await query(
      'INSERT INTO leads (business_id, type) VALUES ($1::uuid, $2)',
      [resolvedId, type]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error tracking lead:', error);
    res.status(500).json({ error: 'Failed to track lead' });
  }
};

export const getLeadsSummary = async (req: any, res: Response) => {
  console.log('GET /api/leads/summary - Request received');
  const seller_id = req.user.id;
  console.log('GET /api/leads/summary - Seller ID:', seller_id);

  try {
    const leads = await query(
      `SELECT l.type, count(*) as count
       FROM leads l
       JOIN businesses b ON l.business_id = b.id
       WHERE b.seller_id = $1::uuid
       GROUP BY l.type`,
      [seller_id]
    );
    console.log('GET /api/leads/summary - Leads found:', leads.length);

    const summary: Record<string, number> = {
      call: 0,
      whatsapp: 0
    };

    leads.forEach((lead: any) => {
      if (lead.type === 'call' || lead.type === 'whatsapp') {
        summary[lead.type] = parseInt(lead.count);
      }
    });

    console.log('GET /api/leads/summary - Summary:', summary);
    res.json(summary);
  } catch (error) {
    console.error('GET /api/leads/summary - Error:', error);
    res.status(500).json({ error: 'Failed to fetch leads summary' });
  }
};

export const getLeads = async (req: any, res: Response) => {
  const seller_id = req.user.id;

  try {
    const leads = await query(
      `SELECT l.*, b.name as business_name
       FROM leads l
       JOIN businesses b ON l.business_id = b.id
       WHERE b.seller_id = $1::uuid
       ORDER BY l.created_at DESC
       LIMIT 50`,
      [seller_id]
    );

    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};
