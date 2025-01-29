import { Router } from "express";
import protectRoute from "../middleware/auth";
import {roadmap} from "../controllers/Testroudmap.controller"
import { getAllRoadmap, getRoadmapById } from "../controllers/Testroudmap.controller";


const router = Router();

router.post("/generate-roadmap", protectRoute(), roadmap);
router.post("/roadmaps",getAllRoadmap);
router.post("/roadmaps/:id", getRoadmapById);
export default router;