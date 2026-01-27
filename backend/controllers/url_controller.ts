import { Request, Response } from "express";
import { ERROR_MAP } from "../utils/errorMap";
import { generateShortKey } from "../utils/encoder";
import {getCache, setCache, recordLastUsed} from "../utils/cacheUtils";
import { fetchUrlService, createShortUrlService } from "../services/url_service";
import dotenv from 'dotenv';
dotenv.config();

export const handlefetchUrl = async(req: Request, res: Response) => {
    const shortId = req.params.shortId;
    const cacheKey = `key:${shortId}`;
    if (typeof shortId !== "string") {
        const {status, message} = ERROR_MAP.INVALID_SHORT_KEY;
        return res.status(status).json({data: null, message });
    }
    try{
        const cachedUrl = await getCache(cacheKey);
        if(cachedUrl){
            recordLastUsed(shortId);
            return res.status(302).redirect(cachedUrl);
        }
        const response = await fetchUrlService(shortId as string);
        // console.log("Response from service:", response);
        if (response.error) {
            const { status, message } = ERROR_MAP[response.error];
            return res.status(status).json({data: null, message });
        }
        if (!response.data) {
            const { status, message } = ERROR_MAP.INTERNAL_ERROR;
            return res.status(status).json({data: null, message });
        }
        await setCache(cacheKey, response?.data.original_url, response.data.ttl);
        recordLastUsed(shortId);
        return res.status(302).redirect(response.data.original_url);
    }
    catch(err){
        console.error("Error in fetch Url:", err);
        const {status, message} = ERROR_MAP.INTERNAL_ERROR;
        return res.status(status).json({data: null, message});
    }
}

export const handleShortenUrl = async(req: Request, res: Response) => {
    try{
        const { url, cust_expiry } = req.body;
        const shortKEY = generateShortKey(url);
        const response = await createShortUrlService(url,shortKEY, cust_expiry);
        // console.log("Response from service:", response);
        if(response.error || !response.data){
            const { status, message } = ERROR_MAP["INTERNAL_ERROR"];
            return res.status(status).json({data : null, message});
        }
        response.data.short_key = `${process.env.SERVER_URL}${shortKEY}`;
        return res.status(201).json({data: response.data, message: "Short URL created successfully"});
    }catch(err){
        console.error("Error in shorten Url:", err);
        const { status, message } = ERROR_MAP.INTERNAL_ERROR;
        return res.status(status).json({ message });
    }
}
