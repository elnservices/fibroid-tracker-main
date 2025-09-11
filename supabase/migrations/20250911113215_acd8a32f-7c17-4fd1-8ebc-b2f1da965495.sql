-- Create or replace function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for symptom monitoring logs
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  pain smallint NOT NULL DEFAULT 0,
  bleeding smallint NOT NULL DEFAULT 0,
  fatigue smallint NOT NULL DEFAULT 0,
  pressure smallint NOT NULL DEFAULT 0,
  total_score smallint GENERATED ALWAYS AS (pain + bleeding + fatigue + pressure) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pain_range CHECK (pain BETWEEN 0 AND 3),
  CONSTRAINT bleeding_range CHECK (bleeding BETWEEN 0 AND 3),
  CONSTRAINT fatigue_range CHECK (fatigue BETWEEN 0 AND 3),
  CONSTRAINT pressure_range CHECK (pressure BETWEEN 0 AND 3)
);

-- Helpful indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_symptom_logs_user_date ON public.symptom_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_user_created ON public.symptom_logs(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'symptom_logs' AND policyname = 'Users can view their own logs'
  ) THEN
    CREATE POLICY "Users can view their own logs"
    ON public.symptom_logs
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'symptom_logs' AND policyname = 'Users can insert their own logs'
  ) THEN
    CREATE POLICY "Users can insert their own logs"
    ON public.symptom_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'symptom_logs' AND policyname = 'Users can update their own logs'
  ) THEN
    CREATE POLICY "Users can update their own logs"
    ON public.symptom_logs
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'symptom_logs' AND policyname = 'Users can delete their own logs'
  ) THEN
    CREATE POLICY "Users can delete their own logs"
    ON public.symptom_logs
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_symptom_logs_updated_at ON public.symptom_logs;
CREATE TRIGGER update_symptom_logs_updated_at
BEFORE UPDATE ON public.symptom_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();