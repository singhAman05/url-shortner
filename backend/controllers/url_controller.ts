import { Request, Response } from "express";
import { fetchUrlService, createShortUrlService } from "../services/url_service";
import { generateShortKey } from "../utils/encoder";
import {getCache, setCache} from "../utils/cacheUtils";
import dotenv from 'dotenv';
dotenv.config();

export const handlefetchUrl = async(req: Request, res: Response) => {
    const shortId = req.params.shortId;
    const cacheKey = `key:${shortId}`;
    try{
        const cachedUrl = await getCache(cacheKey);
        if(cachedUrl){
            return res.redirect(cachedUrl);
        }
        const response = await fetchUrlService(shortId as string);
        // console.log("Response from service:", response);
        if(response.error || !response.data){
            return res.status(404).json({message: "URL not found"});
        }
        await setCache(cacheKey, response.data.original_url, 3600);
        return res.redirect(response.data.original_url);
    }
    catch(err){
        console.error("Error in fetch Url:", err);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const handleShortenUrl = async(req: Request, res: Response) => {
    try{
        const { url } = req.body;
        const shortKEY = generateShortKey(url);
        const response = await createShortUrlService(url,shortKEY);
        // console.log("Response from service:", response);
        if(response.error || !response.data){
            return res.status(500).json({message: "Failed to create short URL"});
        }
        await setCache(`key:${shortKEY}`, url, 3600);
        response.data.short_key = `${process.env.SERVER_URL}${shortKEY}`;
        return res.status(201).json({data: response.data, message: "Short URL created successfully"});
    }catch(err){
        console.error("Error in shorten Url:", err);
        return res.status(500).json({message: "Internal Server Error"});
    }
}
