import { describe, it, expect, jest } from '@jest/globals';

// Mock Supabase
jest.unstable_mockModule('../config/supabase.js', () => ({
  supabaseAdmin: {
    rpc: jest.fn<any>().mockResolvedValue({
      data: [
        {
          id: 'job-1',
          type: 'payment_success',
          payload: { bookingId: 'booking-123', amount: 1000 },
          attempts: 1
        }
      ],
      error: null
    }),
    from: jest.fn<any>().mockImplementation((table: string) => {
      if (table === 'expert_bookings') {
        return {
          select: jest.fn<any>().mockReturnThis(),
          eq: jest.fn<any>().mockReturnThis(),
          single: jest.fn<any>().mockResolvedValue({
            data: { expert_id: 'mentor-abc', amount_paid: 1000 },
            error: null
          })
        };
      }
      return {
        insert: jest.fn<any>().mockReturnThis(),
        update: jest.fn<any>().mockReturnThis(),
        eq: jest.fn<any>().mockResolvedValue({ data: {}, error: null })
      };
    })
  }
}));

const { JobWorkerService } = await import('../services/jobWorkerService.js');
const { supabaseAdmin } = await import('../config/supabase.js');

describe('JobWorkerService Tests', () => {
  it('should claim and process jobs successfully', async () => {
    const result = await JobWorkerService.processBatch(5);
    expect(result.processed).toBe(1);
    expect(result.errors).toBe(0);

    // Verify claim_pending_jobs RPC was called
    expect(supabaseAdmin.rpc).toHaveBeenCalledWith('claim_pending_jobs', { p_limit: 5 });
  });
});
