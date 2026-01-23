import cron from 'node-cron';
import { supabase } from '../config/supabase';
import redisClient from '../config/redis';

export const updateLastUsedJob = () =>{
    cron.schedule('*/1 * * * *', async () => {
        try{
            const entries = await redisClient.hGetAll('metaData:lastUsed');
            const keys = Object.keys(entries);
            if (keys.length === 0) {
                return;
            }

            for (const shortId of keys) {
                const timestamp = Number(entries[shortId]);
                if (Number.isNaN(timestamp)) continue;

                await supabase
                    .from("urls")
                    .update({
                        last_used: new Date(timestamp).toISOString()
                    })
                    .eq("short_key", shortId);
            }

            await redisClient.del('metaData:lastUsed');
            console.log(`[CRON] Updated ${keys.length} records`);
        }catch(err){
            console.error("[CRON] Failed to flush last_used", err);
        }
    });
}