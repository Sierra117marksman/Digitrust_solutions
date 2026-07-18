import { NextResponse } from 'next/server';
import { runBackup } from '@/lib/backup/runBackup';

export const maxDuration = 300; // 5 minutes max for Vercel Cron

export async function GET(req: Request) {
  // Validate Cron Secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { auditLog } = await runBackup({
      trigger: 'system',
      reason: 'cron',
      label: 'daily'
    });

    return NextResponse.json({ success: true, log: auditLog });
  } catch (error: unknown) {
    console.error("[Cron Queue Error]", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

