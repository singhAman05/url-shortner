// Db password : 6#uwPVWGMww/7wr
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = `${process.env.SUPABASE_URL}`;
const supabaseKey = `${process.env.SUPABASE_KEY}`;

export const supabase = createClient(supabaseUrl, supabaseKey);