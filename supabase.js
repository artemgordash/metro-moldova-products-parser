import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://zbgtpwphigiimgkmmvkq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZ3Rwd3BoaWdpaW1na21tdmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg1MjE1OTUsImV4cCI6MTk5NDA5NzU5NX0.Mjir2233iDORS6DMv52zBeEtxhyFYmsXjYOmsTJVKeE')