import { supabaseAdmin } from '../config/supabase.js';
import { DiagnosticService } from './diagnosticService.js';
import { logger } from '../utils/logger.js';

export class JobWorkerService {
  /**
   * Processes a batch of pending jobs from the queue.
   * Can be triggered by a cron scheduler or run in an internal loop.
   */
  static async processBatch(limit: number = 5): Promise<{ processed: number; errors: number }> {
    let processedCount = 0;
    let errorCount = 0;

    try {
      // Step 1: Claim pending jobs atomically using pg locking
      const { data: jobs, error: claimError } = await supabaseAdmin.rpc('claim_pending_jobs', {
        p_limit: limit
      });

      if (claimError) {
        logger.error('Error claiming pending jobs:', claimError);
        return { processed: 0, errors: 0 };
      }

      if (!jobs || jobs.length === 0) {
        return { processed: 0, errors: 0 };
      }

      logger.info(`Claimed ${jobs.length} jobs to process.`);

      // Step 2: Process each job
      for (const job of jobs) {
        try {
          await this.executeJob(job);
          
          // Mark job as completed
          const { error: completeError } = await supabaseAdmin
            .from('job_queue')
            .update({
              status: 'completed',
              processed_at: new Date().toISOString()
            })
            .eq('id', job.id);

          if (completeError) throw completeError;
          processedCount++;

        } catch (jobErr: any) {
          errorCount++;
          logger.error(`Job Execution Failed [ID: ${job.id}, Type: ${job.type}]:`, jobErr);

          // Update job attempt status
          const status = job.attempts >= 3 ? 'failed' : 'pending';
          await supabaseAdmin
            .from('job_queue')
            .update({
              status,
              error_log: `${jobErr.message}\n${jobErr.stack}`,
              locked_at: null // release lock for retry if pending
            })
            .eq('id', job.id);
        }
      }
    } catch (err: any) {
      logger.error('Critical failure in job processing batch:', err);
    }

    return { processed: processedCount, errors: errorCount };
  }

  private static async executeJob(job: any): Promise<void> {
    const payload = job.payload;

    switch (job.type) {
      case 'ai_generation':
        // Run AI diagnostic evaluation
        await DiagnosticService.processDiagnosticJob(
          payload.assessmentId,
          payload.userId,
          payload.targetRole,
          payload.weeklyHours,
          payload.skills,
          payload.experienceLevel
        );
        break;

      case 'payment_success':
        // Process post-payment business logic (mentor payouts, audit logging)
        const { bookingId, amount } = payload;
        
        // Fetch booking to get expert/mentor details
        const { data: booking, error: bookingError } = await supabaseAdmin
          .from('expert_bookings')
          .select('expert_id, amount_paid')
          .eq('id', bookingId)
          .single();

        if (bookingError) throw bookingError;
        if (!booking) throw new Error(`Booking not found: ${bookingId}`);

        // Payout Allocation: 80% to Mentor, 20% Platform Fee
        const amountPaid = Number(booking.amount_paid);
        const mentorAmount = amountPaid * 0.8;
        const platformFee = amountPaid * 0.2;

        const { error: payoutError } = await supabaseAdmin
          .from('mentor_payouts')
          .insert({
            booking_id: bookingId,
            mentor_id: booking.expert_id,
            amount: mentorAmount,
            platform_fee: platformFee,
            status: 'eligible'
          });

        if (payoutError) throw payoutError;

        // Log to audit log
        await supabaseAdmin
          .from('audit_logs')
          .insert({
            user_id: booking.expert_id,
            action_type: 'payout_allocated',
            entity_id: bookingId,
            metadata: { amount: mentorAmount, platformFee }
          });
        break;

      default:
        throw new Error(`Unsupported job type: ${job.type}`);
    }
  }
}
