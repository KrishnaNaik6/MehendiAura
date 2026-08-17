-- ====================================================================
-- Visitor & Customer Activity Logs Table Migration
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.visitor_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    action TEXT NOT NULL, -- 'page_view', 'whatsapp_click', 'call_click', 'service_view', 'jewellery_view', 'gallery_view'
    details TEXT,
    language TEXT DEFAULT 'en',
    device TEXT DEFAULT 'desktop',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- Allow Public to INSERT logs (for tracking page views and WhatsApp clicks)
CREATE POLICY "Public visitor_logs insert policy"
    ON public.visitor_logs FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow Authenticated Admins to SELECT and view logs
CREATE POLICY "Admin visitor_logs select policy"
    ON public.visitor_logs FOR SELECT
    TO authenticated
    USING (true);

-- Indexes for fast analytics queries
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON public.visitor_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_action ON public.visitor_logs (action);
