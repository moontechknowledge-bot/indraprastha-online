import { Request, Response } from 'express';
import { query, isValidUUID } from '../lib/db';

export const submitPayment = async (req: any, res: Response) => {
  const { business_id, screenshot_url } = req.body;

  if (!isValidUUID(business_id)) {
    return res.status(400).json({ error: 'Invalid business ID format' });
  }

  if (!screenshot_url) {
    return res.status(400).json({ error: 'Screenshot URL is required' });
  }

  try {
    // Check if business exists and belongs to the user
    const [business] = await query(
      'SELECT * FROM businesses WHERE id = $1::uuid AND seller_id = $2::uuid',
      [business_id, req.user.id]
    );

    if (!business) {
      return res.status(404).json({ error: 'Business not found or access denied' });
    }

    // Save payment request
    const [request] = await query(
      `INSERT INTO payment_requests (business_id, screenshot_url, status)
       VALUES ($1::uuid, $2, 'pending')
       RETURNING *`,
      [business_id, screenshot_url]
    );

    res.json({
      success: true,
      message: 'Payment request submitted successfully',
      request
    });
  } catch (error) {
    console.error('Error submitting payment:', error);
    res.status(500).json({ error: 'Failed to submit payment request' });
  }
};

export const getPendingPayments = async (req: any, res: Response) => {
  try {
    const requests = await query(
      `SELECT pr.*, b.name as business_name, u.name as seller_name, u.email as seller_email
       FROM payment_requests pr
       JOIN businesses b ON pr.business_id = b.id
       JOIN users u ON b.seller_id = u.id
       WHERE pr.status = 'pending'
       ORDER BY pr.created_at DESC`
    );
    res.json(requests);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ error: 'Failed to fetch pending payments' });
  }
};

export const approvePayment = async (req: any, res: Response) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({ error: 'Invalid request ID format' });
  }

  try {
    const [request] = await query(
      'SELECT * FROM payment_requests WHERE id = $1::uuid',
      [id]
    );

    if (!request) {
      return res.status(404).json({ error: 'Payment request not found' });
    }

    // Update request status
    await query(
      "UPDATE payment_requests SET status = 'approved' WHERE id = $1::uuid",
      [id]
    );

    // Upgrade business
    await query(
      `UPDATE businesses 
       SET plan_type = 'prime', 
           status = 'approved',
           payment_status = 'SUCCESS',
           is_active = true,
           is_verified = true, 
           is_featured = true 
       WHERE id = $1::uuid`,
      [request.business_id]
    );

    res.json({ success: true, message: 'Payment approved and business upgraded' });
  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json({ error: 'Failed to approve payment' });
  }
};

export const rejectPayment = async (req: any, res: Response) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({ error: 'Invalid request ID format' });
  }

  try {
    await query(
      "UPDATE payment_requests SET status = 'rejected' WHERE id = $1::uuid",
      [id]
    );
    res.json({ success: true, message: 'Payment request rejected' });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    res.status(500).json({ error: 'Failed to reject payment' });
  }
};

export const directUpgrade = async (req: any, res: Response) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({ error: 'Invalid business ID format' });
  }

  try {
    await query(
      `UPDATE businesses 
       SET plan_type = 'prime', 
           status = 'approved',
           payment_status = 'SUCCESS',
           is_active = true,
           is_verified = true, 
           is_featured = true 
       WHERE id = $1::uuid`,
      [id]
    );
    res.json({ success: true, message: 'Business upgraded to PRIME directly' });
  } catch (error) {
    console.error('Error in direct upgrade:', error);
    res.status(500).json({ error: 'Failed to upgrade business' });
  }
};

export const downgradeToFree = async (req: any, res: Response) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({ error: 'Invalid business ID format' });
  }

  try {
    await query(
      `UPDATE businesses 
       SET plan_type = 'free', 
           payment_status = 'PENDING',
           is_verified = false, 
           is_featured = false 
       WHERE id = $1::uuid`,
      [id]
    );
    res.json({ success: true, message: 'Business downgraded to FREE' });
  } catch (error) {
    console.error('Error in downgrade:', error);
    res.status(500).json({ error: 'Failed to downgrade business' });
  }
};

export const upgradeToPrime = async (req: any, res: Response) => {
  const { businessId } = req.body;

  if (!isValidUUID(businessId)) {
    return res.status(400).json({ error: 'Invalid business ID format' });
  }

  try {
    // For demo/simplicity, we just upgrade directly
    // In a real app, this would be triggered after successful payment verification
    await query(
      `UPDATE businesses 
       SET plan_type = 'prime', 
           payment_status = 'SUCCESS',
           is_active = true,
           is_verified = true, 
           is_featured = true 
       WHERE id = $1::uuid AND seller_id = $2::uuid`,
      [businessId, req.user.id]
    );
    res.json({ success: true, message: 'Business upgraded to PRIME successfully' });
  } catch (error) {
    console.error('Error in upgradeToPrime:', error);
    res.status(500).json({ error: 'Failed to upgrade business' });
  }
};
