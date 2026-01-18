import {Router} from "express";
import { handlefetchUrl, handleShortenUrl } from "../controllers/url_controller";
const router=Router();

router.get('/:shortId', handlefetchUrl);
router.post('/shorten', handleShortenUrl);
export default router;