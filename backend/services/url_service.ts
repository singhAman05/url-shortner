import { supabase } from "../config/supabase";
import { ERROR_MAP } from "../utils/errorMap";
export type Error = keyof typeof ERROR_MAP;

export const fetchUrlService = async (shortId: string) : Promise<{
    data: { original_url: string; ttl: number } | null;
    error: Error | null;
}> => {
    const { data, error } = await supabase
        .from('urls')
        .select('original_url, cust_expiry')
        .eq('short_key', shortId)
        .single();
    if(error){
        return { data: null, error: "DB_ERROR" };
    }
    if (!data) {
        return { data: null, error: "NOT_FOUND" };
    }
    if (data.cust_expiry) {
        const remaining =
        new Date(data.cust_expiry).getTime() - Date.now();
        if (remaining <= 0) {
        return { data: null, error: "EXPIRED"};
        }
    }

    const ttl = data.cust_expiry ? Math.min(Math.floor((new Date(data.cust_expiry).getTime() - Date.now()) / 1000), 3600) : 3600;
    return {data: {original_url: data.original_url, ttl},error: null};
}

export const createShortUrlService = async (originalUrl: string, shortKEY : string, cust_expiry: string | null) => {
    const { data, error } = await supabase
        .from('urls')
        .insert([{ original_url: originalUrl, short_key: shortKEY, cust_expiry: cust_expiry }])
        .select('*')
        .single();
    if(error){
        return { data: null, error: "DB_ERROR" };
    }
    return { data, error };
}