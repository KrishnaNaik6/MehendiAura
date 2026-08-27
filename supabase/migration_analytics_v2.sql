-- ====================================================================
-- Analytics V2 Migration: Daily Filtering & High-Performance Indexes
-- Supports Asia/Kolkata daily date boundaries and unmixed CTA tracking
-- ====================================================================

-- Add columns if not already present
ALTER TABLE public.visitor_logs
    ADD COLUMN IF NOT EXISTS visit_date TEXT,
    ADD COLUMN IF NOT EXISTS visited_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS operating_system TEXT,
    ADD COLUMN IF NOT EXISTS browser TEXT,
    ADD COLUMN IF NOT EXISTS device_name TEXT,
    ADD COLUMN IF NOT EXISTS viewport_width INT,
    ADD COLUMN IF NOT EXISTS viewport_height INT,
    ADD COLUMN IF NOT EXISTS referrer TEXT;

-- Composite and single column indexes for high-speed IST queries & daily table lookups
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at_desc ON public.visitor_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_visit_date ON public.visitor_logs (visit_date);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_action_created ON public.visitor_logs (action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session_id ON public.visitor_logs (session_id);
