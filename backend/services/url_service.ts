import { supabase } from "../config/supabase";

export const fetchUrlService = async (shortId: string) => {
    const { data, error } = await supabase
        .from('urls')
        .select('original_url')
        .eq('short_key', shortId)
        .single();
    return { data, error };
}

export const createShortUrlService = async (originalUrl: string, shortKEY : string) => {
    const { data, error } = await supabase
        .from('urls')
        .insert([{ original_url: originalUrl, short_key: shortKEY }])
        .select('*')
        .single();
    return { data, error };
}